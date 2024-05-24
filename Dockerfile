# build stage
FROM node:18
RUN apk update && apk add libc6
WORKDIR /code
COPY . ./
RUN npm install
RUN	npm run build:production

