import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from './projects.schema';
import { ProjectsService } from './projects.service';

const projectsService = new ProjectsService();

export async function projectsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', server.authenticate);

  server.get('/', {
    schema: {
      querystring: z.object({ workspaceId: z.string().uuid().optional() }),
    },
    handler: async (request, reply) => {
      const { workspaceId } = request.query as any;
      try {
        const projects = await projectsService.getAllProjects(workspaceId);
        return reply.send({ data: projects });
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
        const project = await projectsService.getProjectById(id);
        return reply.send({ data: project });
      } catch (error: any) {
        return reply.code(404).send({ error: 'Not Found', message: error.message });
      }
    },
  });

  server.post('/', {
    schema: { body: createProjectSchema },
    handler: async (request, reply) => {
      const input = request.body as any;
      try {
        const project = await projectsService.createProject(input);
        return reply.code(201).send({ data: project });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });

  server.patch('/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: updateProjectSchema,
    },
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const input = request.body as any;
      try {
        const project = await projectsService.updateProject(id, input);
        return reply.send({ data: project });
      } catch (error: any) {
        return reply.code(400).send({ error: 'Bad Request', message: error.message });
      }
    },
  });
}
