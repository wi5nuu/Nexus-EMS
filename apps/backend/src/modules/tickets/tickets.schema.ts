import { z } from 'zod';

export const createTicketSchema = z.object({
  ticketProjectId: z.string().uuid(),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'TRIAGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).default('OPEN'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  assigneeId: z.string().uuid().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'TRIAGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
