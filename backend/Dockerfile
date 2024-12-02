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

# Copier uniquement composer.json et composer.lock pour installer les dépendances
COPY composer.json composer.lock ./

# # # Install Symfony Runtime (ajout important)
# RUN composer require symfony/runtime
RUN composer require symfony/runtime:"^6.4" --update-with-dependencies

RUN composer install --optimize-autoloader

# Copier le reste des fichiers de l'application
COPY . .

# # Symfony/doctrine/php composer bundles etc..
# RUN composer require symfony/serializer -W \
#     && composer require symfony/validator -W \
#     RUN composer require symfony/monolog-bundle \
#     && composer require symfony/maker-bundle --dev doctrine/doctrine-fixtures-bundle --dev nelmio/cors-bundle \
#     && composer install --no-interaction --prefer-dist --optimize-autoloader

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

