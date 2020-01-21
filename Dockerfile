FROM node:12

# cache dependencies
ADD package-lock.json /tmp/package-lock.json
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/
ADD . ./src
WORKDIR /src
CMD ["npm", "run", "start:debug"]
EXPOSE 3000