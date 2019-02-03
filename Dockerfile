FROM node:11
RUN mkdir /app
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN /bin/bash -c "apt-get update && apt-get install -y build-essential mc"

RUN npm i -g node-gyp
RUN npm i
COPY . /app/
RUN /app/node_modules/.bin/tsc
