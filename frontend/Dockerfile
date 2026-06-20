FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:latest

WORKDIR /shared

COPY --from=builder /app/dist .

CMD ["sh", "-c", "cp -r ./* /shared && tail -f /dev/null"]
