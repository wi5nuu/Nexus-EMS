FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/web/package.json ./apps/web/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend/

WORKDIR /app/apps/backend
RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install necessary libraries for Prisma query engine on Alpine
RUN apk add --no-cache openssl zlib curl libgcc

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules

USER nestjs
EXPOSE 8080
CMD ["node", "dist/app.js"]
