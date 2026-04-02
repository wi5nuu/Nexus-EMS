import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with idempotent Enterprise data...');

  // 1. Organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'vanguard-corp' },
    update: {},
    create: {
      name: 'Vanguard Corp',
      slug: 'vanguard-corp',
    },
  });

  // 2. Admin User
  const passwordHash = await argon2.hash('password123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vanguard.sh' },
    update: {
      passwordHash,
      firstName: 'Wisnu',
      lastName: 'Dev',
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@vanguard.sh',
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
        name: 'Vanguard Engineering',
        organizationId: organization.id,
      }
    });
  }

  const project = await prisma.project.upsert({
    where: { key: 'PLAT' },
    update: {},
    create: {
      name: 'Vanguard Core Platform',
      key: 'PLAT',
      workspaceId: workspace.id,
    }
  });

  // 4. Domain 4: Tickets
  const ticketProject = await prisma.ticketProject.upsert({
    where: { key: 'SUP' },
    update: {},
    create: {
      name: 'Vanguard Global Support',
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
      jobTitle: 'Vanguard Principal Engineer',
      departmentId: department.id,
      joinDate: new Date(),
      phoneNumber: '+62 821-2345-6789',
      officeLocation: 'Jakarta HQ (SCBD)',
      githubHandle: '@Wisnu-vanguard',
      awsHandle: 'vanguard-admin',
      slackHandle: 'Wisnu',
    },
  });

  // ... (Permissions section remains same as resource names are neutral or already correct)
  
  // 6. Permissions & Roles
  const standardPermissions = [
    { resource: 'Tickets', action: 'Read' },
    { resource: 'Tickets', action: 'Manage' },
    { resource: 'HR', action: 'Read' },
    { resource: 'HR', action: 'Manage' },
    { resource: 'Audit', action: 'Read' },
    { resource: 'Infrastructure', action: 'Manage' },
    { resource: 'Security', action: 'Manage' },
  ];

  const permissions = [];
  for (const p of standardPermissions) {
    const perm = await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }

  const adminRole = await prisma.role.upsert({
    where: { id: 'admin-role-id' }, // Stable ID for seeding
    update: {},
    create: {
      id: 'admin-role-id',
      name: 'ADMIN',
      description: 'System Administrator with full access to enterprise clusters.',
      organizationId: organization.id,
    }
  });

  // Link Admin User to Admin Role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });

  // Assign all permissions to Admin Role
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // 7. Salary Bands
  const bands = [
    { level: 'L1', minSalary: 4000, maxSalary: 6500 },
    { level: 'L2', minSalary: 7000, maxSalary: 11500 },
    { level: 'L3', minSalary: 12000, maxSalary: 18000 },
    { level: 'L4', minSalary: 19000, maxSalary: 28000 },
    { level: 'L5', minSalary: 30000, maxSalary: 55000 },
  ];

  for (const b of bands) {
    await prisma.salaryBand.create({
      data: {
        level: b.level,
        minSalary: b.minSalary,
        maxSalary: b.maxSalary,
        organizationId: organization.id,
      }
    });
  }

  console.log('Seeding complete. User: admin@vanguard.sh / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
