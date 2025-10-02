FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable && \
    corepack prepare yarn@stable --activate && \
    yarn install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]