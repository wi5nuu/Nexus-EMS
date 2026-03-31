import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with idempotent Enterprise data...');

  // 1. Organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'nexus-corp' },
    update: {},
    create: {
      name: 'Nexus Corp',
      slug: 'nexus-corp',
    },
  });

  // 2. Admin User
  const passwordHash = await argon2.hash('password123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexus.co' },
    update: {
      passwordHash,
      firstName: 'Wisnu',
      lastName: 'Dev',
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@nexus.co',
      passwordHash,
      firstName: 'Wisnu',
      lastName: 'Dev',
      status: 'ACTIVE',
      organizationId: organization.id,
    },
  });

  // 3. Domain 2: Projects & Tasks
  let workspace = await prisma.workspace.findFirst({ where: { organizationId: organization.id } });
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Nexus Engineering',
        organizationId: organization.id,
      }
    });
  }

  const project = await prisma.project.upsert({
    where: { key: 'PLAT' },
    update: {},
    create: {
      name: 'Core Platform',
      key: 'PLAT',
      workspaceId: workspace.id,
    }
  });

  // 4. Domain 4: Tickets
  const ticketProject = await prisma.ticketProject.upsert({
    where: { key: 'SUP' },
    update: {},
    create: {
      name: 'Internal Support',
      key: 'SUP',
      organizationId: organization.id,
    }
  });

  const existingTicket = await prisma.ticket.findFirst({ where: { title: 'Database connection spiking to 100% CPU' } });
  if (!existingTicket) {
    await prisma.ticket.create({
      data: {
        ticketProjectId: ticketProject.id,
        title: 'Database connection spiking to 100% CPU',
        description: 'The primary Postgres database is experiencing severe CPU spikes.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        reporterId: admin.id,
        assigneeId: admin.id,
      }
    });
  }

  // 5. Domain 3: HR Data
  let department = await prisma.department.findFirst({ 
    where: { organizationId: organization.id, name: 'Engineering' } 
  });
  
  if (!department) {
    department = await prisma.department.create({
      data: {
        name: 'Engineering',
        organizationId: organization.id,
      }
    });
  }

  await prisma.employeeProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      jobTitle: 'Principal Engineer',
      departmentId: department.id,
      joinDate: new Date(),
      phoneNumber: '+62 821-2345-6789',
      officeLocation: 'Jakarta HQ (SCBD)',
      githubHandle: '@Wisnu-nexus',
      awsHandle: 'nexus-admin',
      slackHandle: 'Wisnu',
    },
  });

  console.log('Seeding complete. User: admin@nexus.co / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
