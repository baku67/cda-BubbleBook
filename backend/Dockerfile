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

# Copier le script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/

# Donner les permissions d'exécution au script d'entrée
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Définir le point d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]

# Exposer le port 80
EXPOSE 80

# Fix "Forbidden 403"
COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite