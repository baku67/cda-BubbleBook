# Dockerfile
FROM php:8.2-apache

# Dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Directory
WORKDIR /var/www/html

COPY . .

# Symfony/doctrine/php composer bundles etc..
RUN composer require symfony/serializer \
    && composer require symfony/validator \
    && composer require symfony/monolog-bundle \
    && composer require symfony/maker-bundle --dev doctrine/doctrine-fixtures-bundle --dev nelmio/cors-bundle \
    && composer install --no-interaction --prefer-dist --optimize-autoloader

# Install Symfony Runtime (ajout important)
RUN composer require symfony/runtime

# Fix "Forbidden 403"
COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite


# Copier le script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
# Donner les permissions d'exécution au script d'entrée
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Définir le point d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]

# Exposer le port 80
EXPOSE 80

