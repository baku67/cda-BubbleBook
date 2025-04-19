paire de clés SSH danbs googleDrive

Se placer là ou se trouve la clé SSH ("Bubblebook aws ec2.pem" (dispo sur googleDrive)) et lancer la commande:
(askip il faut sudo mais ça marche sans ?)
ssh -i "Bubblebook aws ec2.pem" ec2-user@ec2-13-39-60-71.eu-west-3.compute.amazonaws.com


   ,     #_
   ~\_  ####_        Amazon Linux 2023
  ~~  \_#####\
  ~~     \###|
  ~~       \#/ ___   https://aws.amazon.com/linux/amazon-linux-2023
   ~~       V~' '->
    ~~~         /
      ~~._.   _/
         _/ _/
       _/m/'
[ec2-user@ip-172-31-14-88 ~]$ 




### Installation docker et user/droits:
# Mettre à jour votre système
sudo dnf update -y
# Installer Docker
sudo dnf install -y docker
# Démarrer le service Docker
sudo systemctl start docker
# Activer le démarrage automatique de Docker au boot
sudo systemctl enable docker
# Ajouter l’utilisateur ec2-user au groupe docker (pour éviter d’utiliser 'sudo' à chaque fois)
sudo usermod -aG docker ec2-user
# Se déconnecter/reconnecter pour que les changements de groupe soient pris en compte
exit
# Puis reconnectez-vous via SSH


### Installation docker-compose:
# Aller dans /usr/local/bin
cd /usr/local/bin
# Récupérer la dernière version stable de docker-compose (v2.x)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o docker-compose
# Rendre exécutable
sudo chmod +x docker-compose
# Vérifier la version
docker-compose version


Groupe de sécurité dans AWS console: ajouter "HTTP" (80) dans connexions entrantes et mettre tous les ipv4
Normalement on y voit aussi la connection SSH depuis mon IP locale
(On accède au site avec http://+ipv4 de l'instance)

(Si on veut juste test le fonctionnement avec un simple serveur nginx/apache et un index.html:
ssh:
"docker run -d \
  -p 80:80 \
  -v /home/ec2-user/index.html:/usr/share/nginx/html/index.html:ro \
  --name mon-serveur-web \
  nginx"
)

### (AVANT) Papatrier/cloner/deplacer projet
- Copier avec SCP depuis machine locale (hors connection ssh "exit"):
  -> PAS BON IDEE CAR COPIE VENDOR ET NODE MODULES
"scp -i "Bubblebook aws ec2.pem" -r /chemin/vers/votre/projet ec2-user@ec2-15-236-131-79.eu-west-3.compute.amazonaws.com:~/"
- Cloner avec Git (BON IDEE):
"sudo dnf install -y git"
"git clone https://github.com/baku67/cda-BubbleBook.git"

/!\ (APRES) Optimisation build Angular (pour éviter de build sur place trop lourd)
ssh-ec2: "sudo dnf install -y git"
ssh-ec2: "git clone https://github.com/baku67/cda-BubbleBook.git"

racine ./frontend:
"ng build --configuration production" sur machine locale puissante
-> créé build dans /dist/angular/browser
Désactiver toute la section "*apache*" du docker-compose.prod (car on ne veut plus cette étape en prod sur EC2), enfait si mais on pointe sur l'image DockerHub de mon build opti (prod.yaml à jour)

Image opti du build sur DockerHub:
(Avant de build: modifier l'URL du envrionments.prod.ts !!) Sinon solutions: Nom de domaine ou Elastic IP sur EC2.
(IL FAUDRA AUSSI CHANGER L'ip dans docker-compose.prod.yaml pour pointer vers l'instance, et ça c'est cloné) solution -> nom de domaine encore ou Elastic IP ?
racine projet:
# docker build -f frontend/Dockerfile.prod --build-arg BUILD_DIR=frontend/dist/angular/browser -t frontopti:latest .
# docker tag frontopti nujabb/front-opti:latest
# docker push nujabb/front-opti:latest


Sur EC2:
"git clone https://github.com/baku67/cda-BubbleBook.git" ...

  Copiage le .env dans le ./backend du AWS: (se placer dans /c avec la clée ou tu sais)
  "scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/.env" ec2-user@ec2-13-39-60-71.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/"

  Copiage les private.pem et public.pem dans le backend/config/jwt:
  "scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/config/jwt/public.pem" ec2-user@ec2-13-39-60-71.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/config/jwt/" 
  "scp -i "/c/Users/basil/Downloads/ssh/Bubblebook aws ec2.pem" -r "/c/laragon/www/cda-BubbleBook/backend/config/jwt/private.pem" ec2-user@ec2-13-39-60-71.eu-west-3.compute.amazonaws.com:/home/ec2-user/cda-BubbleBook/backend/config/jwt/" 

  Modifier l'URL envrionnement.prod.ts (avant le build dockerHub, parce que le fichier comme ça sert à rien en SSH)
  angular.json fileReplacement à jour

ET enfin:
"docker-compose -f docker-compose.prod.yaml up --build" (on garde --build quand meme pour l'image php)
-> "-d" si on veut laisser tourner l'instance et couper l'ordi ou le terminal


### Concerné par IP/DOMAIN (ElasticIP + domaine Hostinger):
nelmio_cors (faire une version prod)
envrionments.prod.ts
docker-compose.prod.yaml x2 


### Lancement:
- cd ~/mon-dossier-projet
- docker-compose up --build (-d)
### Controler que tout va bien:
- docker-compose ps
- docker-compose logs -f

### Commandes Docker 
docker stop xxx-serveur
docker rm xxx-serveur
docker volume ls
docker volume rm xxx-volume
Pour tout clean -> 
  "docker system prune -a --volumes" (suppr tout ce qui est stoppé)
  "docker rm -f $(docker ps -aq) \
    && docker rmi -f $(docker images -q) \
    && docker volume rm $(docker volume ls -q)" (suppr tout)
  "sudo rm -rf cda-BubbleBook"

### MISE A JOUR DU PROJET
- Je crois qu'on peut faire ça grâce à DockerHub, et après avec Docker login puis Docker push on met juste à jour la différence, mais on peut tout refaire à la main
- Puis sur la machine distante ssh aws:
  "docker ps -a"
  "docker stop xxx"
  "docker rm xxx"



### CRON sur l'instance pour lancer le docker-compose.prod.yaml quand on relance l'instance
(sudo yum install cronie -y)
(sudo systemctl start crond)
(sudo systemctl enable crond)
crontab -e
@reboot cd /home/ec2-user/cda-BubbleBook && docker-compose -f docker-compose.prod.yaml up -d
