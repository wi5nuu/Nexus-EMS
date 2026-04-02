import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  managerId: z.string().uuid().nullable(),
  _count: z.object({
    employees: z.number(),
    teams: z.number(),
  }).optional(),
});

export const salaryBandSchema = z.object({
  id: z.string().uuid(),
  level: z.string(),
  minSalary: z.string(),
  maxSalary: z.string(),
});

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
});

export const updateOrgSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
});
