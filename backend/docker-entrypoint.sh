#!/bin/sh
set -e




######## ETAPE 1 : COMPOSER
# Exécutez composer install si le répertoire vendor est vide
if [ ! -d "vendor" ]; then
    composer install
fi



######## ETAPE 2 : BDD
# Attendre que PostgreSQL soit disponible
until pg_isready -h postgres -p 5432 > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Créer la base de données si elle n'existe pas
php bin/console doctrine:database:create --if-not-exists

# Mettre à jour le schéma
php bin/console doctrine:schema:update --force

# Charger les fixtures
php bin/console doctrine:fixtures:load --no-interaction





######## ETAPE 3
# Démarrer Apache
apache2-foreground
