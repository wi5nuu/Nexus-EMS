import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createTicketSchema, updateTicketSchema } from './tickets.schema';
import { TicketsService } from './tickets.service';

const ticketsService = new TicketsService();

export async function ticketsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', server.authenticate);

  server.get('/', {
    schema: {
      querystring: z.object({ projectId: z.string().uuid().optional() }),
    },
    handler: async (request, reply) => {
      const { projectId } = request.query as any;
      try {
        const tickets = await ticketsService.getAllTickets(projectId);
        return reply.send({ data: tickets });
      } catch (error: any) {
        return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
      }
    },
  });

  server.get('/:id', {
    schema: { params: z.object({ id: z.string().uuid() }) },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      try {
        const ticket = await ticketsService.getTicketById(id);
        return reply.send({ data: ticket });
      } catch (error: any) {
        return reply.code(404).send({ error: 'Not Found', message: error.message });
      }
    },
  });

  server.post('/', {
    schema: { body: createTicketSchema },
    handler: async (request, reply) => {
      const reporterId = (request.user as any)?.sub;
      const input = request.body as any;
      if (!reporterId) return reply.code(401).send({ error: 'Unauthorized', message: 'Missing user context' });

      try {
        const ticket = await ticketsService.createTicket(reporterId, input);
        return reply.code(201).send({ data: ticket });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });

  server.patch('/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: updateTicketSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const input = request.body as any;
      try {
        const ticket = await ticketsService.updateTicket(id, input);
        return reply.send({ data: ticket });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });
}
