FROM php:8.2-cli

WORKDIR /var/www/html

COPY . .

RUN apt-get update && apt-get install -y \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql

EXPOSE 3002

CMD ["php", "-S", "0.0.0.0:3002", "-t", "public"]
