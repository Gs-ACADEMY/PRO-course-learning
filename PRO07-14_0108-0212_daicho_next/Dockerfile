# 箱 1（台帳の Next.js）の作り方。compose.yaml の build: . がこのファイルを読む
# Node.js の版は固定する（CI と同じ 24）
FROM node:24-bookworm-slim AS build
WORKDIR /app
# Prisma のマイグレーションの道具が openssl を使う
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
# 作るときは形だけの値を入れる（本物の値は、動かすときに .env から渡る）
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build \
    BETTER_AUTH_SECRET=build-time-placeholder-not-used-when-running-00000000
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
# 動かすたびに、まだ当てていないマイグレーションを当ててから起動する
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
