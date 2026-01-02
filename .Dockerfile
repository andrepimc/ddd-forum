FROM node:24 AS build

WORKDIR /usr/src

COPY package.json package-lock.json ./
COPY .node_mdodules/ ./.node_modules

RUN npm install

COPY . .

FROM node:24.12.0-alpine3.23

WORKDIR /usr/src

COPY --from=build /usr/src/package.json ./package.json
COPY --from=build /usr/src/dist ./dist
COPY --from=build /usr/src/node_modules ./node_modules

EXPOSE 3333

CMD ["node", "dist/main.js"]
