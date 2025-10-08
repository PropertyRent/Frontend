# Multi-stage build for React/Vite frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set build-time environment variables
ARG VITE_APP_URL=http://localhost:8001
ARG VITE_API_BASE_URL=http://localhost:8001/api
ARG VITE_REDIRECT_URL=https://landlord-studio.us.auth0.com/login?state=hKFo2SA5ZzlaZndoOHNldjR4VVFxSk9vbmlfZ3A4c0ZmMlRBNaFupWxvZ2luo3RpZNkgdUhxNTFUVWlqaVdmb1RvVXRobUNGdnZIRWhfY003WFCjY2lk2SBpdkxXVHJXaTZTaDMzMDJRUlMzUW8xc2pMQUpGeTk0Rw&client=ivLWTrWi6Sh3302QRS3Qo1sjLAJFy94G&protocol=oauth2&scope=openid%20email%20profile%20offline_access&response_type=code&redirect_uri=https%3A%2F%2Ftenant.landlordstudio.com%2Fapi%2Fauth%2Fcallback&audience=https%3A%2F%2Ftenant.landlordstudio.com&nonce=MEWEphC3aJ1ZaswwNZ8sa5Pln9fqPbnPLHdrifneklY&code_challenge_method=S256&code_challenge=MvnhtEHI9SMLBUSeRPk4FGSlXRKWNzLIyBsgHoH-Wfk
ARG VITE_CHATBOT_ENABLED=true
ARG VITE_CHATBOT_DEBUG=false
ARG VITE_DEV_MODE=true
ARG VITE_LOG_LEVEL=info

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]