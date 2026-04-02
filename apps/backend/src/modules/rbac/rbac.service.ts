import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RBACService {
  async listRoles(organizationId: string) {
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { organizationId },
          { organizationId: null }, // System global roles
        ],
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return roles.map(role => ({
      ...role,
      userCount: role._count.users,
      permissions: role.permissions.map(p => p.permission),
    }));
  }

  async listPermissions() {
    return prisma.permission.findMany();
  }

  async createRole(organizationId: string, data: { name: string; description?: string; permissions: string[] }) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          name: data.name,
          description: data.description,
          organizationId,
        },
      });

      if (data.permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permissions.map(permissionId => ({
            roleId: role.id,
            permissionId,
          })),
        });
      }

      return role;
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return prisma.$transaction(async (tx) => {
      // 1. Delete existing
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // 2. Add new
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map(pId => ({
            roleId,
            permissionId: pId,
          })),
        });
      }

      return { success: true };
    });
  }
}
