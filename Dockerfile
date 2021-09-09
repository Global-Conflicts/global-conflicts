FROM node:12-alpine as build
EXPOSE 5000
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend ./
CMD npm run build
cmd npm i -g serve
CMD serve -p 5000 ./build

