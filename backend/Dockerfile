# Dockerfile
FROM php:8.2-apache

# Installez les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*


# Installez Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copiez vos fichiers d'application
COPY . .

## Installer le DoctrineFixturesBundle
# RUN composer require doctrine/doctrine-fixtures-bundle --dev
# # Installez les dépendances PHP y compris le maker-bundle
# RUN composer install --no-interaction --prefer-dist --optimize-autoloader \
#     && composer require symfony/maker-bundle --dev
## Installez les dépendances PHP y compris le maker-bundle et doctrine-fixtures-bundle
# RUN composer require symfony/maker-bundle --dev doctrine/doctrine-fixtures-bundle --dev \
#     && composer install --no-interaction --prefer-dist --optimize-autoloader

# Installez les dépendances PHP y compris le maker-bundle et doctrine-fixtures-bundle et nelmio (API)
RUN composer require symfony/maker-bundle --dev doctrine/doctrine-fixtures-bundle --dev nelmio/cors-bundle \
&& composer install --no-interaction --prefer-dist --optimize-autoloader


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

