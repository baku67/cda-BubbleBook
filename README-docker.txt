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
(Sert à exécuter certaines tâches dans un ordre précis (composer, database:create, ... avant de démarrer serveur Apache)) 
Le fichier $docker-entrypoint.sh doit etre en LF et CRLF (!)

"" Lorsque vous configurez un script d'entrée (entrypoint) dans le Dockerfile (comme dans l'exemple avec docker-entrypoint.sh), ce script gère tout : il exécute les commandes Doctrine, attend que PostgreSQL soit prêt, puis démarre Apache avec apache2-foreground.





***************************************************************************************
Commandes PHP Docker:

Au lieu de faire des (pas Docker): 
~  php bin/console doctrine:database:create --if-not-exists
~  symfony console doctrine:database:create --if-not-exists

On fait des (Docker): 
~ docker-compose exec php php bin/console doctrine:database:create --if-not-exists

Ouvrir un bash dans le conteneur docker php-symfony:
~ docker exec -it php-symfony bash
~ docker exec -it php-symfony bash

Ou Shell dans Angular:
~ docker exec -it cda-bubblebook-angular-1 /bin/sh




$ docker container ls
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS                           NAMES
adf53a1aa3d3   dpage/pgadmin4       "/entrypoint.sh"         22 minutes ago   Up 22 minutes   443/tcp, 0.0.0.0:5050->80/tcp   cda-bubblebook-pgadmin-1
00f8460bad77   cda-bubblebook-php   "docker-entrypoint.sh"   22 minutes ago   Up 22 minutes   0.0.0.0:8000->80/tcp            php-symfony
3a226cc1c506   postgres:15          "docker-entrypoint.s…"   22 minutes ago   Up 22 minutes   0.0.0.0:5432->5432/tcp          cda-bubblebook-postgres-1
c00728d43419   httpd:latest         "httpd-foreground"       22 minutes ago   Up 22 minutes   0.0.0.0:8080->80/tcp            cda-bubblebook-apache-1
69baca46961e   node:latest          "docker-entrypoint.s…"   22 minutes ago   Up 22 minutes   0.0.0.0:4200->4200/tcp          cda-bubblebook-angular-1


$ docker volume ls   
DRIVER    VOLUME NAME
local     cda-bubblebook_pg_data

