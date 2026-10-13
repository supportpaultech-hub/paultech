# Use official Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package lock and package.json for efficient layer caching
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci --omit=dev

# Copy backend source files
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

# Expose server port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start Node.js application
CMD ["npm", "start"]
