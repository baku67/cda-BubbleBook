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

    symfony console cache:clear 

    symfony console make:entity Name
    symfony console doctrine:database:create

    symfony console make:migration
    symfony console doctrine:make:migration

    symfony console doctrine:schema:update --force


    symfony console make:fixture



