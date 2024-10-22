Installer ruby avec RubyInstaller
Relancer Vscode
~ gem install mailcatcher

composer require symfony/mailer

# config/packages/dev/mailer.yaml
framework:
    mailer:
        dsn: 'smtp://127.0.0.1:1025'

# config/framework.yaml:
framework:
    ...
    mailer:
        dsn: 'smtp://mailer:1025'


docker-compose.yaml:
  ###> symfony/mailer ###
  mailer:
    image: axllent/mailpit
    ports:
      - "1025:1025"
      - "8025:8025"  # Interface web de Mailpit
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1
    ###< symfony/mailer ###


Interface webmail:
http://localhost:8025  
ou <ip_pc>:8025


TESTER: 
terminal dans container php-symfony
apt-get update
apt-get install iputils-ping
ping mailer (nom du service docker)