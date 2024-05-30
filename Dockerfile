FROM node:18-alpine as build
WORKDIR /app
COPY package.json package.json
RUN npm install
#RUN	npm run build

FROM node:18-alpine
COPY . .
COPY --from=build /app /app


