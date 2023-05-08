# Base image
FROM node:14-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

RUN npm run build

# Expose the port that Vite will run on
EXPOSE 3000

# Start the Vite server

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
