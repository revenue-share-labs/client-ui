# build stage
FROM node:18 as builder
WORKDIR /code
COPY . ./

RUN npm install
RUN	npm run build:gitlab

# app stage
FROM nginx:stable-alpine
COPY --from=builder /code/out /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
