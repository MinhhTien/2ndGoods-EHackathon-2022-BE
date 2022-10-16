FROM node:16.14.2
WORKDIR /app_be
COPY package.json .
RUN npm install
COPY . .
COPY .env.deploy .env