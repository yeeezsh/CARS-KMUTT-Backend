FROM node:12 as base
COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn install

FROM base as dev
COPY . .
CMD ["yarn", "start:debug"]
EXPOSE 3000 9229

FROM base as uat
COPY . .
RUN  yarn build
WORKDIR /dist
CMD ["node", "main.js"]
EXPOSE 3000
