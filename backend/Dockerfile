# Dockerfile
FROM php:8.2-apache

# Installez les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Installez Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copiez vos fichiers d'application
COPY . .

# Exposer le port 80
EXPOSE 80