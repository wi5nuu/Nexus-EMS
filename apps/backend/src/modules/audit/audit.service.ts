import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {
  async listAuditLogs(organizationId: string, options: { limit?: number; offset?: number; action?: string } = {}) {
    const { limit = 50, offset = 0, action } = options;
    
    return prisma.auditLog.findMany({
      where: {
        organizationId,
        ...(action ? { action } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  async logAction(data: {
    organizationId: string;
    userId: string | null;
    action: string;
    resource: string;
    resourceId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
      },
    });
  }
}
