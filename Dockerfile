FROM node:12-alpine as build
EXPOSE 5000
WORKDIR /app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend ./
RUN npm run build
RUN npm i -g serve
CMD serve -s ./build -p 5000 --cors

