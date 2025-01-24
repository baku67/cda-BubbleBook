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

# Génération des clés localhost-cert.pem et localhost-key.pem pour HTTPS en local (pour "withSecure" Cookie RefreshToken)
RUN apt-get update && apt-get install -y openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/localhost-key.pem \
    -out /etc/ssl/certs/localhost-cert.pem \
    -subj "/CN=localhost"

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

# FIX "Forbidden 403"
COPY apache.conf /etc/apache2/sites-available/000-default.conf
# FIX pour HTTPS en localhost (pour le cookie de RefreshToken)
COPY default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
# COPY localhost-cert.pem /etc/ssl/certs/
# COPY localhost-key.pem /etc/ssl/private/

RUN a2enmod ssl
RUN a2ensite default-ssl
RUN a2enmod rewrite


# ENTRYPOINT: Script qui se lance automatiquement lorsque le conteneur démarre. Il définit le point d'entrée du conteneur et contrôle le processus principal à exécuter.
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Initialisation et la préparation de l'environnement et BDD avant de lancer le serveur Apache
ENTRYPOINT ["docker-entrypoint.sh"]

# Exposer le port 80
EXPOSE 80

