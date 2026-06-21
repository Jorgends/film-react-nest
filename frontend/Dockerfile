FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:latest

WORKDIR /app-dist
COPY --from=builder /app/dist .

CMD ["sh", "-c", "cp -r /app-dist/. /shared/ && tail -f /dev/null"]
