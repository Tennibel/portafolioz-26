# Multi-stage build for Portafolio Z
FROM node:22-slim AS build
WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:22-slim
WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Create directories for persistent data
RUN mkdir -p /app/data /app/uploads/projects

EXPOSE 4000
ENV HOST=0.0.0.0 PORT=4000 NODE_ENV=production

CMD ["node", "./dist/server/entry.mjs"]
