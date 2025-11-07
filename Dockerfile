FROM node:23-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:23-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app ./

RUN yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["yarn", "start"]
