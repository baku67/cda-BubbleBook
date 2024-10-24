**************************************
.env et .env.test
environments.ts (check apiUrl ! et IP réseau)

#######################################
docker exec -it php-symfony sh
composer require symfony/monolog-bundle


**************************************
Il faut Openssl (dl een ligne) pour générer les clées localement:
(se placer dans le dossier backend, git bash)
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -algorithm rsa -pkeyopt rsa_keygen_bits:4096
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem