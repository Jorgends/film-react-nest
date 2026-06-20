FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:latest

# Явно создаем директорию /shared, которая примонтирована к volume
WORKDIR /shared

COPY --from=builder /app/dist .

# Копируем файлы из текущей папки сборки в корень shared-директории
CMD ["sh", "-c", "cp -r ./* /shared && tail -f /dev/null"]
