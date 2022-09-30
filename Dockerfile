# syntax=docker/dockerfile:1

FROM node:latest
#set environment
ENV NODE_ENV=production
#set working dir
WORKDIR /app
#copy requirements to the working dir
COPY ["package.json", "package-lock.json", "./"]
#install dependencies
RUN npm install --production
COPY . .
CMD ["node", "app.js"]