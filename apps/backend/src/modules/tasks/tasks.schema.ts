import { z } from 'zod';

export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  sprintId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  storyPoints: z.number().int().min(0).optional(),
  order: z.number().default(0),
  assigneeIds: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  storyPoints: z.number().int().min(0).optional(),
  order: z.number().optional(),
  sprintId: z.string().uuid().optional().nullable(),
  assigneeIds: z.array(z.string().uuid()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
