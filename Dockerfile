# build environment
FROM node:10.19.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@4.0.3 -g --silent
COPY ./frontend ./
RUN npm run build

# production environment
FROM nginx:stable
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html

