dev:

    prerequis: Installer PostgreSQL dans le dossier Laragon/bin, 
    
    .env DATABASE_URL
    Dans doctrine.yaml: url:'%env(resolve:DATABASE_URL)%'

    Bien mettre le dossier du projet dans www de Laragon (pour le php.ini)

    Et faire pointer Laragon sur le dossier racine du projet


    Version de PHP de Laragon:
    $env:PATH="C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64;$env:PATH"

    Vérifier l'extension postgres:
    php -m | findstr pgsql

    


    php.ini: décommenter extension=pgsql et extension=pdo_pgsql




    #####################################################


    Attention au environements.ts qui spécifie l'ApiUrl si on test sur PC ou sur mobile (debuggage USB via chrome PC: chrome://inspect/#devices)


    ######################################################
    Quand j'ajoute une route, si elle peut etre appelé sans etre authentifié:
    -> dans backend/config/security.yaml: 
    access_control:
        - { path: ^/api/check-email, roles: IS_AUTHENTICATED_ANONYMOUSLY }




    #####################################################

    symfony console cache:clear 

    symfony console make:entity Name
    symfony console doctrine:database:create

    symfony console make:migration
    symfony console doctrine:make:migration

    symfony console doctrine:schema:update --force


    symfony console make:fixture



############## Acces au container (bash): 
$ docker exec -it php-symfony bash


############## Consulter les logs:
$ docker exec -it php-symfony bash
root@a6fd440878e8:/var/www/html# tail -f var/log/dev.log






**************************************
Il faut Openssl (dl een ligne) pour générer les clées localement:
(se placer dans le dossier backend, git bash)
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -algorithm rsa -pkeyopt rsa_keygen_bits:4096
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem