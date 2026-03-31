import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { LoginInput, UpdateProfileInput } from './auth.schema';

const prisma = new PrismaClient();

export class AuthService {
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

    return prisma.$transaction(async (tx) => {
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
