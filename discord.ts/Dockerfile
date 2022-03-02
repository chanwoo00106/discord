FROM node:16.13.1-alpine

RUN apk add --no-cache tzdata

ENV TZ Asia/Seoul

# Create app directory
WORKDIR /usr/src/app

# Move all files
COPY . /usr/src/app/

# RUN npm install
RUN yarn

# Build project
RUN yarn build

# Start bot
CMD [ "node", "build/main.js" ]
