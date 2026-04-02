import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { OrganizationService } from './org.service';
import { organizationSchema, updateOrgSchema, departmentSchema, salaryBandSchema } from './org.schema';

const orgService = new OrganizationService();

export async function organizationRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/details', {
    onRequest: [fastify.authenticate, fastify.authorize('Infrastructure', 'Manage')],
    schema: {
      response: {
        200: z.object({ data: organizationSchema }),
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const orgData = await orgService.getDetails(orgId);
      if (!orgData) return reply.code(404).send({ error: 'Not Found', message: 'Organization not found' });
      return { data: orgData };
    },
  });

  server.patch('/details', {
    onRequest: [fastify.authenticate, fastify.authorize('Infrastructure', 'Manage')],
    schema: {
      body: updateOrgSchema,
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const body = request.body as any;
      const updated = await orgService.updateDetails(orgId, body);
      return { data: updated };
    },
  });

  server.get('/departments', {
    onRequest: [fastify.authenticate, fastify.authorize('Infrastructure', 'Manage')],
    schema: {
      response: {
        200: z.object({ data: z.array(departmentSchema) }),
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const depts = await orgService.getDepartments(orgId);
      return { data: depts as any };
    },
  });

  server.get('/salary-bands', {
    onRequest: [fastify.authenticate, fastify.authorize('Infrastructure', 'Manage')],
    schema: {
      response: {
        200: z.object({ data: z.array(salaryBandSchema) }),
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const bands = await orgService.getSalaryBands(orgId);
      return { data: bands as any };
    },
  });
}
