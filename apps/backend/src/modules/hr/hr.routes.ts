import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
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
    onRequest: [fastify.authenticate, fastify.authorize('HR', 'Read')], // Need authorize to ensure roles
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      return hrService.listLeaveRequests(orgId);
    },
  });

  server.patch('/leave/requests/:id', {
    onRequest: [fastify.authenticate, fastify.authorize('HR', 'Manage')],
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

  /**
   * EMPLOYEE DIRECTORY
   */
  server.get('/employees', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const employees = await hrService.listEmployees(orgId);
      return reply.send({ data: employees });
    },
  });

  server.get('/employees/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string().uuid() }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const employee = await hrService.getEmployeeById(id);
      if (!employee) return reply.code(404).send({ error: 'Not Found', message: 'Employee not found' });
      return reply.send({ data: employee });
    },
  });

  server.patch('/employees/:id', {
    onRequest: [fastify.authenticate, fastify.authorize('HR', 'Manage')],
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        status: z.string().optional(),
        jobTitle: z.string().optional(),
        departmentId: z.string().uuid().optional(),
        teamId: z.string().uuid().optional().nullable(),
      }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const employee = await hrService.updateEmployee(id, body);
      return reply.send({ data: employee });
    },
  });

  server.get('/teams', {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const teams = await hrService.listTeams(orgId);
      return reply.send({ data: teams });
    },
  });

  server.get('/teams/:id/members', {
    onRequest: [fastify.authenticate],
    schema: {
      params: z.object({ id: z.string().uuid() }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const members = await hrService.listTeamMembers(id);
      return reply.send({ data: members });
    },
  });

  server.post('/employees', {
    onRequest: [fastify.authenticate],
    schema: {
      body: z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        jobTitle: z.string().min(1),
        departmentId: z.string().uuid().optional(),
        teamId: z.string().uuid().optional(),
      }),
    },
    handler: async (request, reply) => {
      const { orgId } = request.user as any;
      const body = request.body as any;
      try {
        const employee = await hrService.createEmployee(orgId, body);
        return reply.code(201).send({ data: employee });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });
}
