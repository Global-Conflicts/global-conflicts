FROM node:12-alpine as build
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend ./
EXPOSE 80
CMD npm run production

