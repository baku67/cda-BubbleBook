paire de clés SSH danbs googleDrive

Se placer là ou se trouve la clé SSH ("Bubblebook aws ec2.pem") et lancer la commande:
(askip il faut sudo mais ça marche sans ?)
ssh -i "Bubblebook aws ec2.pem" ec2-user@ec2-51-44-222-232.eu-west-3.compute.amazonaws.com


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

### Papatrier/cloner/deplacer projet
- Copier avec SCP depuis machine locale (hors connection ssh "exit"):
  -> PAS BON IDEE CAR COPIE VENDOR ET NODE MODULES
"scp -i "Bubblebook aws ec2.pem" -r /chemin/vers/votre/projet ec2-user@ec2-15-236-131-79.eu-west-3.compute.amazonaws.com:~/"
- Cloner avec Git (BON IDEE):
"sudo dnf install -y git"
"git clone https://github.com/baku67/cda-BubbleBook.git"


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

### MISE A JOUR DU PROJET
- Je crois qu'on peut faire ça grâce à DockerHub, et après avec Docker login puis Docker push on met juste à jour la différence, mais on peut tout refaire à la main
- Puis sur la machine distante ssh aws:
  "docker ps -a"
  "docker stop xxx"
  "docker rm xxx"
