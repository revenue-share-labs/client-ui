FROM node:18-alpine
WORKDIR /code
COPY . ./
RUN npm install
RUN	npm run build

