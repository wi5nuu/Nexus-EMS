import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from './tasks.schema';
import { TasksService } from './tasks.service';

const tasksService = new TasksService();

export async function tasksRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  // Use authentication middleware for all task routes
  server.addHook('onRequest', server.authenticate);

  // 1. Get tasks by project ID
  server.get('/', {
    schema: {
      querystring: z.object({
        projectId: z.string().uuid(),
      }),
    },
    handler: async (request, reply) => {
      const { projectId } = request.query as any;
      try {
        const tasks = await tasksService.getTasksByProject(projectId);
        return reply.send({ data: tasks });
      } catch (error: any) {
        return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
      }
    },
  });

  // 2. Get specific task by ID
  server.get('/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      try {
        const task = await tasksService.getTaskById(id);
        return reply.send({ data: task });
      } catch (error: any) {
        if (error.message === 'Task not found') {
          return reply.code(404).send({ error: 'Not Found', message: error.message });
        }
        return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
      }
    },
  });

  // 3. Create a new task
  server.post('/', {
    schema: {
      body: createTaskSchema,
    },
    handler: async (request, reply) => {
      const userInput = request.body as any;
      const reporterId = (request.user as any)?.sub; // Assuming JWT sub is the user ID

      if (!reporterId) {
        return reply.code(401).send({ error: 'Unauthorized', message: 'User ID missing from token' });
      }

      try {
        const newTask = await tasksService.createTask(reporterId, userInput);
        return reply.code(201).send({ data: newTask });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });

  // 4. Update an existing task
  server.patch('/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: updateTaskSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const updateInput = request.body as any;

      try {
        const updatedTask = await tasksService.updateTask(id, updateInput);
        return reply.send({ data: updatedTask });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });

  // 5. Delete a task
  server.delete('/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      
      try {
        await tasksService.deleteTask(id);
        return reply.code(204).send();
      } catch (error: any) {
        return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
      }
    },
  });
}
