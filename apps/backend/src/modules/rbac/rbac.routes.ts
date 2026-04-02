import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { RBACService } from './rbac.service';
import { listRolesSchema, listPermissionsSchema, createRoleSchema } from './rbac.schema';

const rbacService = new RBACService();

export async function rbacRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/roles', {
    onRequest: [fastify.authenticate, fastify.authorize('Security', 'Manage')],
    schema: {
      response: {
        200: listRolesSchema,
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const roles = await rbacService.listRoles(orgId);
      return { data: roles };
    },
  });

  server.get('/permissions', {
    onRequest: [fastify.authenticate, fastify.authorize('Security', 'Manage')],
    schema: {
      response: {
        200: listPermissionsSchema,
      },
    },
    handler: async (request, reply) => {
      const permissions = await rbacService.listPermissions();
      return { data: permissions };
    },
  });

  server.post('/roles', {
    onRequest: [fastify.authenticate, fastify.authorize('Security', 'Manage')],
    schema: {
      body: createRoleSchema,
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const body = request.body as any;
      const role = await rbacService.createRole(orgId, body);
      return reply.code(201).send({ data: role });
    },
  });

  server.patch('/roles/:id/permissions', {
    onRequest: [fastify.authenticate, fastify.authorize('Security', 'Manage')],
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ permissions: z.array(z.string().uuid()) }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const { permissions } = request.body as any;
      await rbacService.updateRolePermissions(id, permissions);
      return { success: true };
    },
  });
}
