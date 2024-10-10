Démarrer tout les conteneurs:
git bash ~docker-compose up -d

ou dans le doute (si dockerfile modifié, pour regénéré les images):
git bash ~docker-compose up --build


Pour rentrer dans le container "php-symfony": 
~docker exec -it php-symfony bash
permet de régler soucis de persmission dossier var:
~chown -R www-data:www-data /var/www/html/var
~chmod -R 775 /var/www/html/var

Le container "composer" se lance juste pour effectuer un composer install puis s'arrete (normal)


Installer les dépendances manuellement sur l'environnement Linux de Docker:
~docker-compose run angular npm install
~docker-compose run composer install



bug build DOCKER-ENTRYPOINT.SH :
Le fichier $docker-entrypoint.sh doit etre en LF et CRLF (!)








