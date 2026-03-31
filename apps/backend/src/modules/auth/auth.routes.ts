import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { loginSchema, authResponseSchema, updateProfileSchema } from './auth.schema';
import { AuthService } from './auth.service';

const authService = new AuthService();

export async function authRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post('/login', {
    schema: {
      body: loginSchema,
      response: {
        200: authResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body as any;
      
      try {
        const user = await authService.validateUser({ email, password });
        
        const accessToken = fastify.jwt.sign({
          sub: user.id,
          orgId: user.organizationId,
          roles: ['ENGINEER'], 
        }, { expiresIn: '15m' });

        const refreshToken = fastify.jwt.sign({
          sub: user.id,
        }, { expiresIn: '7d' });

        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            organization_id: user.organizationId,
          },
          accessToken,
          refreshToken,
        };
      } catch (error: any) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: error.message,
          statusCode: 401,
        });
      }
    },
  });

  server.get('/me', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      const profile = await authService.getProfile(userId);
      return profile;
    },
  });

  server.patch('/me', {
    onRequest: [fastify.authenticate],
    schema: {
      body: updateProfileSchema,
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      const input = request.body as any;
      const profile = await authService.updateProfile(userId, input);
      return profile;
    },
  });
}
