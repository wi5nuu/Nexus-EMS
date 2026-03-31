import { z } from 'zod';

// Leave Schemas
export const leaveRequestSchema = z.object({
  type: z.enum(['ANNUAL', 'SICK', 'UNPAID', 'PARENTAL']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().optional(),
});

export const leaveResponseSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const leaveBalanceSchema = z.object({
  type: z.string(),
  accrued: z.number(),
  used: z.number(),
  pending: z.number(),
});

// Attendance Schemas
export const clockInSchema = z.object({
  location: z.any().optional(),
  device: z.string().optional(),
});

export const attendanceResponseSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string(),
  clockIn: z.string(),
  clockOut: z.string().nullable(),
  location: z.any().nullable(),
  device: z.string().nullable(),
});
