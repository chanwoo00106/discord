FROM node:16.15.1-alpine

WORKDIR /app

COPY ./yarn.lock ./package.json ./

RUN yarn install --frozen-lockfile

COPY ./tsconfig.json ./

COPY ./.env.production ./

COPY ./src ./src

RUN yarn build

ENTRYPOINT ["yarn", "start"]
