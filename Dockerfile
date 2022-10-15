FROM node:16.14.2
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY .env.deploy .env
RUN npm run build