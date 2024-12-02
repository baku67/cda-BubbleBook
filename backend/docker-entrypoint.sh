#!/bin/sh
set -e




######## ETAPE 2 : BDD
# Attendre que PostgreSQL soit disponible
until pg_isready -h postgres -p 5432 > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Créer la base de données si elle n'existe pas
php bin/console doctrine:database:create --if-not-exists

## Mettre à jour le schéma
# php bin/console doctrine:schema:update --force
## OU
# Appliquer les migrations existantes
php bin/console doctrine:migrations:migrate --no-interaction

# Charger les fixtures
php bin/console doctrine:fixtures:load --no-interaction





######## ETAPE 3
# Démarrer Apache
apache2-foreground
