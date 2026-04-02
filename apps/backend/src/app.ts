import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';
import rbacPlugin from './plugins/rbac';
import { authRoutes } from './modules/auth/auth.routes';
import authPlugin from './plugins/auth';
import socketPlugin from './plugins/socket';
import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';

import { kafkaStream } from './shared/events/kafka';

import { tasksRoutes } from './modules/tasks/tasks.routes';
import { projectsRoutes } from './modules/projects/projects.routes';
import { ticketsRoutes } from './modules/tickets/tickets.routes';
import { hrRoutes } from './modules/hr/hr.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { aiRoutes } from './modules/ai/ai.routes';




const prisma = new PrismaClient();
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(({ schema }: any) => {
  return (data: any) => {
    const result = (schema as any).safeParse(data);
    if (result.success) return { value: result.data };
    return { error: result.error };
  };
});

fastify.setSerializerCompiler(({ schema }: any) => {
  return (data: any) => {
    const result = (schema as any).safeParse(data);
    if (result.success) return JSON.stringify(result.data);
    throw result.error;
  };
});

// Plugins Registration
async function bootstrap() {
  try {
    // 1. CORS
    await fastify.register(cors, {
      origin: true, // In production, replace with specific domain
    });

    // 2. JWT
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me-in-prod',
    });

    // 3. Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Nexus EMS API',
          description: 'Enterprise Management System API Documentation',
          version: '1.0.0',
        },
        servers: [
          { url: 'http://localhost:8081' },
        ],
      },
      transform: jsonSchemaTransform,
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
    });

    // 4. Custom Plugins
    await fastify.register(authPlugin);
    await fastify.register(socketPlugin);
    await fastify.register(rbacPlugin);

    // 5. Routes Registration
    await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
    await fastify.register(tasksRoutes, { prefix: '/api/v1/tasks' });
    await fastify.register(projectsRoutes, { prefix: '/api/v1/projects' });
    await fastify.register(ticketsRoutes, { prefix: '/api/v1/tickets' });
    await fastify.register(hrRoutes, { prefix: '/api/v1/hr' });
    await fastify.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
    await fastify.register(aiRoutes, { prefix: '/api/v1/ai' });




    // 6. Health Check
    fastify.get('/health', async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });

    // 5. Global Error Handler
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error);
      reply.status(error.statusCode || 500).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    });

    // Start Server
    // Hugging Face Spaces requires port 7860
    const port = Number(process.env.PORT) || 7860;
    const host = '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    // Connect Kafka after server starts (non-blocking)
    kafkaStream.connect().catch(err => {
      fastify.log.error(`[Kafka] Initial connection failed: ${err.message}`);
    });
    
    fastify.log.info(`Nexus EMS Backend listening on http://${host}:${port}`);
    fastify.log.info(`API Documentation: http://${host}:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

export default fastify;
