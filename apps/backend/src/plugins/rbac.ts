import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (resource: string, action: string) => any;
  }
}

export default fp(async function rbacPlugin(fastify: FastifyInstance) {
  fastify.decorate('authorize', (resource: string, action: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      if (!user) {
        return reply.code(401).send({ error: 'Unauthorized', message: 'Authentication required' });
      }

      // 1. Get User's Roles
      const userRoles = await prisma.userRole.findMany({
        where: { userId: user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      // 2. Check if any role has the required permission
      const hasPermission = userRoles.some(ur => 
        ur.role.permissions.some(rp => 
          rp.permission.resource.toLowerCase() === resource.toLowerCase() && 
          rp.permission.action.toLowerCase() === action.toLowerCase()
        )
      );

      // 3. Special case for SUPERADMIN role (often hardcoded or special flag)
      const isSuperAdmin = userRoles.some(ur => ur.role.name === 'SUPERADMIN' || ur.role.name === 'ADMIN');

      if (!hasPermission && !isSuperAdmin) {
        return reply.code(403).send({ error: 'Forbidden', message: `Missing permission: ${resource}:${action}` });
      }
    };
  });
});
