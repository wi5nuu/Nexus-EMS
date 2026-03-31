import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { AIService } from './ai.service';

const aiService = new AIService();

export async function aiRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post('/triage/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({
          ticketId: z.string(),
          suggestedPriority: z.string(),
          suggestedLabels: z.array(z.string()),
          analysis: z.string(),
          confidence: z.number(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      return aiService.triageTicket(id);
    },
  });

  server.post('/postmortem/:id', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      return aiService.generatePostmortem(id);
    },
  });
}
