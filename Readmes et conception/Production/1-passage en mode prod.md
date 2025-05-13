[](https://chatgpt.com/g/g-p-67653ca479a48191870a1cef7907ac8c-bubblebook/c/67f4d21b-8d3c-8005-baac-3f27c013ff08)

AWS Secrets Manager, AWS Parameter Store, Vault pour les env



Pour l'instant (après clone):

Il faut mettre en place les variables d'environnement autrement qu'avec le .env en prod
Et "FRONT_LOCAL_NETWORK" (pour build URL de confirmation d'email) doit pointer vers le nom de domaine
"DB_URL" todo

Copiage le .env dans le ./backend du AWS:
"scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/.env" ec2-user@ec2-51-44-222-232.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/"

Copiage les private.pem et public.pem dans le backend/config/jwt:
"scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/config/jwt/public.pem" ec2-user@ec2-51-44-222-232.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/config/jwt/" 
"scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/config/jwt/private.pem" ec2-user@ec2-51-44-222-232.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/config/jwt/" 

envrionnement.prod.ts à jour (vérifier Adresse IPv4 de l'instance AWS EC2)
angular.json fileReplacement à jour