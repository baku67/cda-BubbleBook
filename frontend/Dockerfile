FROM node:20.15.1

## TESTING dans container docker (inutile pour ci github actions)
# Installer Chromium et d'autres dépendances
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*
# Définir la variable d'environnement pour Karma
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMIUM_BIN=/usr/bin/chromium

# Créez le répertoire de l'application
WORKDIR /app

# Copiez les fichiers de dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Permet un "watch" plus efficace sur Docker (surveille les fichiers)
# marche sans parce code source en bind mounts et non volumes nommés
RUN npm install chokidar --save-dev

# Copiez tout le reste
COPY . .

# Exposez le port Angular
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "4000", "--ssl", "true", "--ssl-key", "/app/certs/private/localhost-key.pem", "--ssl-cert", "/app/certs/certs/localhost-cert.pem"]