# Stage 1: Build React app
FROM node:20.9.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .nvmrc
COPY .nvmrc ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx and run json-server
FROM nginx:stable

# Copy built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install json-server globally
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && npm install -g json-server

# Copy db.json for json-server
COPY ./src/db/db.json /app/db.json

# Expose ports
EXPOSE 80
EXPOSE 8000

# Start Nginx and json-server
CMD ["sh", "-c", "nginx -g 'daemon off;' & json-server --watch /app/db.json --port 8000"]
