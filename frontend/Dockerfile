FROM node:20.15.1

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
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]