dev:

    Projet cloné =
    .env DATABASE_URL

    Attention a environements.ts qui spécifie l'ApiUrl si on test sur PC ou sur mobile (debuggage USB via chrome PC: chrome://inspect/#devices)

    Exemple d'ajout route, si elle peut etre appelée sans etre authentifié:
    -> dans backend/config/security.yaml: 
    access_control:
        - { path: ^/api/check-email, roles: IS_AUTHENTICATED_ANONYMOUSLY }


    #####################################################
    CMD:
    docker-compose exec php php bin/console cache:clear 

    docker-compose exec php php bin/console make:entity Name


    (NON je crois : )
    docker-compose exec php php bin/console make:migration
    (OUI DOCKER :)
    docker-compose exec php php bin/console doctrine:migrations:diff
    docker-compose exec php php bin/console doctrine:migrations:migrate

    (! plutot préférer migrations):
    docker-compose exec php php bin/console doctrine:schema:update --force

    docker-compose exec php php bin/console doctrine:database:create
    docker-compose exec php php bin/console make:fixture


############## Acces au container (bash): 
$ docker exec -it php-symfony bash


############## Consulter les logs:
$ docker exec -it php-symfony bash
root@a6fd440878e8:/var/www/html# tail -f var/log/dev.log



############# TEST requete curl (pour CORS par exemple):
$ curl -v -X POST http://localhost:8000/api/login -H "Origin: http://localhost:4200" -H "Content-Type: application/json" -d '{"email": "basile08@hotmail.fr", "password": "basile"}'


**************************************
Il faut Openssl (dl een ligne) pour générer les clées localement:
(se placer dans le dossier backend, git bash)
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -algorithm rsa -pkeyopt rsa_keygen_bits:4096
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem



# OSEF parce qu'on dev que dans environnement docker:
    prerequis: Installer PostgreSQL dans le dossier Laragon/bin, 
    Bien mettre le dossier du projet dans www de Laragon (pour le php.ini, + décommenter ext ;sodium et pdo_pgsql/pdo_mysql)
    Et faire pointer Laragon sur le dossier racine du projet
    Version de PHP de Laragon:
    $env:PATH="C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64;$env:PATH"
    ->> EDIT il faut la PHP 8.2 !!!!!!!!!!!!!! (%PATH% 8.2 tout en haut de la liste )
    Vérifier l'extension postgres:
    php -m | findstr pgsql
    php.ini: décommenter extension=pgsql et extension=pdo_pgsql