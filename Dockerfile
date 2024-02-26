FROM node:16-alpine AS build
WORKDIR /app
ARG profile
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build:$profile

FROM nginx:1.23.2-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/mdm /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]