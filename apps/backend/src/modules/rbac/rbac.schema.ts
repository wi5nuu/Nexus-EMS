import { z } from 'zod';

export const permissionSchema = z.object({
  id: z.string().uuid(),
  resource: z.string(),
  action: z.string(),
  description: z.string().nullable(),
});

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(permissionSchema),
  userCount: z.number().optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string().uuid()), // Array of permission IDs
});

export const listRolesSchema = z.object({
  data: z.array(roleSchema),
});

export const listPermissionsSchema = z.object({
  data: z.array(permissionSchema),
});
