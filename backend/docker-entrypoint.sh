# 1.Attendre la disponibilité de la base de données PostgreSQL.
# 2.Créer la base de données si elle n'existe pas.
# 3.Mettre à jour le schéma de la base de données ou appliquer les migrations.
# 4.Charger les fixtures (données de test ou de base).
# 5.Démarrer Apache (le serveur web) comme processus principal.
################################################################

### Indique quel interpréteur le systeme doit utiliser (ici Shell, puis comment se comporter en cas d'erreurs)
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
