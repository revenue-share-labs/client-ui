# build stage
FROM node:18
WORKDIR /code
COPY . ./
RUN npm install
RUN	npm run build:production

