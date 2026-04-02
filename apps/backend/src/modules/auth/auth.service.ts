import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { LoginInput, UpdateProfileInput, GoogleLoginInput } from './auth.schema';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  async loginWithGoogle(input: GoogleLoginInput) {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    const { email, given_name: firstName, family_name: lastName, picture } = payload;

    // 1. Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    // 2. If user doesn't exist, register them (Auto-Create Org)
    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        const orgName = `${firstName}'s Org`;
        const orgSlug = `${orgName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
        
        const org = await tx.organization.create({
          data: {
            name: orgName,
            slug: orgSlug,
          }
        });

        // Create Workspace for the new Org
        const workspace = await tx.workspace.create({
          data: {
            name: 'Main Workspace',
            organizationId: org.id,
            description: 'Your default engineering workspace',
          }
        });

        return tx.user.create({
          data: {
            email,
            firstName: firstName || 'User',
            lastName: lastName || '',
            organizationId: org.id,
            status: 'ACTIVE',
          },
          include: { organization: true },
        });
      });
    }

    return user;
  }

  async registerUser(input: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await argon2.hash(input.password);

    // Create Organization and User in a transaction
    return prisma.$transaction(async (tx) => {
      const orgName = input.organizationName || `${input.firstName}'s Org`;
      const orgSlug = `${orgName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
      
      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug: orgSlug,
        }
      });

      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          organizationId: org.id,
          status: 'ACTIVE',
        },
        include: { organization: true },
      });

      return user;
    });
  }

  async validateUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { organization: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    const isValid = await argon2.verify(user.passwordHash, input.password);
    
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    return user;
  }

  async createSession(userId: string, organizationId: string) {
    // Session creation logic (JWT generation is usually handled in routes/controller)
    // Here we could store session in DB if required
    return { userId, organizationId };
  }

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organizationId: true,
        employeeProfile: {
          select: {
            jobTitle: true,
            imageUrl: true,
            phoneNumber: true,
            officeLocation: true,
            githubHandle: true,
            awsHandle: true,
            slackHandle: true,
          }
        }
      }
    });
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const { firstName, lastName, ...profileData } = input;

    return prisma.$transaction(async (tx: any) => {
      // Update User fields
      if (firstName !== undefined || lastName !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: { firstName, lastName }
        });
      }

      // Update EmployeeProfile fields
      if (Object.keys(profileData).length > 0) {
        await tx.employeeProfile.update({
          where: { userId },
          data: profileData
        });
      }

      return this.getProfile(userId);
    });
  }
}
