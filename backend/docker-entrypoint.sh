#!/bin/sh
set -e

# Exécutez composer install si le répertoire vendor est vide
if [ ! -d "vendor" ]; then
    composer install
fi

# Démarrer Apache
apache2-foreground
