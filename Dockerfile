FROM node:latest

# The port your service will listen on
EXPOSE 8080

COPY package*.json ./

RUN npm install

COPY src ./src

ARG BUILD_TAG=unknown
LABEL BUILD_TAG=$BUILD_TAG

CMD [ "node", "src/app.js" ]