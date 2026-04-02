import { z } from 'zod';

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().nullable(),
  oldValues: z.any().nullable(),
  newValues: z.any().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string(), // ISO string from Prisma
});

export const listAuditLogsSchema = z.object({
  data: z.array(auditLogSchema),
});

export type AuditLogBody = z.infer<typeof auditLogSchema>;
