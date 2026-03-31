import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Enforcer, newEnforcer } from 'casbin';
import path from 'path';

declare module 'fastify' {
  interface FastifyInstance {
    casbin: Enforcer;
    authorize: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function rbacPlugin(fastify: FastifyInstance) {
  const modelPath = path.join(__dirname, '../shared/rbac/model.conf');
  const policyPath = path.join(__dirname, '../shared/rbac/policy.csv');

  const enforcer = await newEnforcer(modelPath, policyPath);

  fastify.decorate('casbin', enforcer);

  fastify.decorate('authorize', async (request: FastifyRequest, reply: FastifyReply) => {
    // Rely on earlier authenticate hook which validates JWT: request.user
    const userRoleOrId = (request.user as any)?.email || 'anonymous';
    const obj = request.url;
    const act = request.method;

    try {
      const allowed = await enforcer.enforce(userRoleOrId, obj, act);
      if (!allowed) {
        reply.code(403).send({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
      }
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: 'Internal Server Error', message: 'RBAC Enforcement failed' });
    }
  });
});
