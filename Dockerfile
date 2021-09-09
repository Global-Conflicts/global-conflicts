# build environment
FROM node:10.19.0-alpine as build
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend ./
RUN npm run build
RUN npm i -g serve
CMD serve -s ./build -l 80

