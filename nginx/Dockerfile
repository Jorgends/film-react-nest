FROM nginx:alpine

# Удаляем дефолтный конфиг, который перебивает наши настройки
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем ваш nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
