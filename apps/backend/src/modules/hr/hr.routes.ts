import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { HRService } from './hr.service';
import { 
  leaveRequestSchema, 
  leaveBalanceSchema, 
  leaveResponseSchema,
  clockInSchema,
  attendanceResponseSchema
} from './hr.schema';

const hrService = new HRService();

export async function hrRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  /**
   * LEAVE MANAGEMENT
   */
  server.get('/leave/balance', {
    onRequest: [fastify.authenticate],
    schema: {
      response: {
        200: { type: 'array', items: leaveBalanceSchema },
      },
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      return hrService.getLeaveBalances(userId);
    },
  });

  server.post('/leave/request', {
    onRequest: [fastify.authenticate],
    schema: {
      body: leaveRequestSchema,
      response: {
        201: leaveResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      const body = request.body as any;
      const data = await hrService.requestLeave(userId, {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      });
      return reply.code(201).send(data);
    },
  });

  server.get('/leave/requests', {
    onRequest: [fastify.authenticate, fastify.authorize], // Need authorize to ensure roles
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      return hrService.listLeaveRequests(orgId);
    },
  });

  server.patch('/leave/requests/:id', {
    onRequest: [fastify.authenticate, fastify.authorize],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: 'APPROVED' | 'REJECTED' };
      const { sub: reviewerId } = request.user as any;
      
      return hrService.approveLeave(id, reviewerId, status);
    },
  });

  /**
   * ATTENDANCE MANAGEMENT
   */
  server.post('/attendance/clock-in', {
    onRequest: [fastify.authenticate],
    schema: {
      body: clockInSchema,
      response: {
        201: attendanceResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      const { location, device } = request.body as any;
      const data = await hrService.clockIn(userId, location, device);
      return reply.code(201).send(data);
    },
  });

  server.post('/attendance/clock-out', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      return hrService.clockOut(userId);
    },
  });

  server.get('/attendance/my-history', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { sub: userId } = request.user as any;
      return hrService.getMyAttendanceHistory(userId);
    },
  });
}
