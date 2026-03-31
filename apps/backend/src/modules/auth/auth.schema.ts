import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const mfaVerifySchema = z.object({
  code: z.string().length(6),
});

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    organization_id: z.string().uuid(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  officeLocation: z.string().optional(),
  githubHandle: z.string().optional(),
  awsHandle: z.string().optional(),
  slackHandle: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
