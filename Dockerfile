# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for the entire monorepo
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/web/package*.json ./apps/web/

# Install dependencies (using npm since package-lock.json is present)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (CRITICAL for monorepo Docker)
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Build the backend
RUN npm run build -w apps/backend

# Copy non-TS files (Casbin configuration) to dist
RUN mkdir -p apps/backend/dist/shared/rbac && cp apps/backend/src/shared/rbac/* apps/backend/dist/shared/rbac/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create a non-root user for Hugging Face
RUN addgroup -S nexus && adduser -S nexus -G nexus
USER nexus

# Copy built files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Hugging Face Spaces default port
ENV PORT=7860
EXPOSE 7860

# Database and other env vars should be set in HF Spaces Settings -> Secrets
# Start the backend
CMD ["npm", "run", "start", "-w", "apps/backend"]
