import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { AuditService } from './audit.service';
import { listAuditLogsSchema } from './audit.schema';

const auditService = new AuditService();

export async function auditRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/', {
    onRequest: [fastify.authenticate, fastify.authorize('Audit', 'Read')],
    schema: {
      querystring: z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        action: z.string().optional(),
      }),
      response: {
        200: listAuditLogsSchema,
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const { limit, offset, action } = request.query as any;
      
      const logs = await auditService.listAuditLogs(orgId, { limit, offset, action });
      return { data: logs as any };
    },
  });
}
