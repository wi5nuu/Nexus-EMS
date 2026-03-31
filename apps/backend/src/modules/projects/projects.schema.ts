import { z } from 'zod';

export const createProjectSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(2).max(100),
  key: z.string().min(2).max(10).toUpperCase(),
  settings: z.record(z.any()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  settings: z.record(z.any()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
