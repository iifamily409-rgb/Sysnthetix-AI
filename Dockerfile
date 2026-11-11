# Google Cloud Run Multi-Stage / Production Dockerfile for Synthetix AI
FROM node:22-slim

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies first for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies required for vite build and tsx runtime)
RUN npm install

# Copy application files
COPY . .

# Build the client SPA into dist/
RUN npm run build

# Cloud Run injects PORT (defaults to 3000 or 8080)
EXPOSE 3000

# Start server using tsx
CMD ["npm", "start"]
