FROM node:12 as dev
# cache dependencies
ADD yarn.lock /tmp/yarn.lock
ADD package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/
ADD . ./src
WORKDIR /src
CMD ["yarn", "start:debug"]
EXPOSE 3000 9229

FROM node:12 as uat
ADD yarn.lock /tmp/yarn.lock
ADD package.json /tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/
ADD . ./src
WORKDIR /src
RUN  yarn build
WORKDIR /src/dist
CMD ["node", "main.js"]
EXPOSE 3000