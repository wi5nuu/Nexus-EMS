import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export async function analyticsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/kpis', {
    onRequest: [fastify.authenticate],
    schema: {
      response: {
        200: z.object({
          totalUsers: z.number(),
          openTickets: z.number(),
          totalProjects: z.number(),
          activeSprints: z.number(),
          timestamp: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      return analyticsService.getKpis(orgId);
    },
  });

  server.get('/sprint-health/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({
          sprintName: z.string(),
          totalPoints: z.number(),
          completedPoints: z.number(),
          progress: z.number(),
          taskCount: z.number(),
          completedTaskCount: z.number(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      return analyticsService.getSprintHealth(id);
    },
  });

  server.get('/insights', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      return analyticsService.getOrganizationInsights(orgId);
    },
  });
}
