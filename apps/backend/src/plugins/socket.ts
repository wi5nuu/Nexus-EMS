import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';
import { redis } from '../shared/redis';

export default fp(async function socketPlugin(fastify: FastifyInstance, opts: any) {
  const io = new Server(fastify.server, {
    cors: {
      origin: '*', // Customize in production to Next.js URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  fastify.decorate('io', io);

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Subscribe to a generic room or project room
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`Client ${socket.id} joined project_${projectId}`);
    });

    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
    });

    socket.on('disconnect', () => {
       console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // Example: Bridge Redis Pub/Sub events into Socket.IO emits
  const redisSubscriber = redis.duplicate();
  redisSubscriber.subscribe('system_notifications', (err, count) => {
    if (err) console.error('Redis Subscribe Error:', err);
  });

  redisSubscriber.on('message', (channel, message) => {
    if (channel === 'system_notifications') {
      io.emit('notification', JSON.parse(message));
    }
  });

  fastify.addHook('onClose', (fastify, done) => {
    io.close();
    redisSubscriber.quit();
    done();
  });
});
