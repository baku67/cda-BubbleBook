#!/bin/sh
set -e

### Attendre que PostgreSQL soit disponible
until pg_isready -h postgres -p 5432 > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

php bin/console doctrine:database:create --if-not-exists
### Mettre à jour le schéma (Avant update --force, maintenant on applique les migrations (mieux))
php bin/console doctrine:migrations:migrate --no-interaction
### Charger les fixtures
php bin/console doctrine:fixtures:load --no-interaction

### Démarrer Apache
apache2-foreground
