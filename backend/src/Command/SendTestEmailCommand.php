<?php

// Se connecter au conteneur php sur l'instance:
// "docker-compose exec php bash"
// Lancer la commande:
// "php bin/console app:send-test-email --env=prod"

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsCommand(
    name: 'app:send-test-email',
    description: 'Envoie un e-mail de test via Amazon SES',
)]
class SendTestEmailCommand extends Command
{
    protected static $defaultName = 'app:send-test-email';

    public function __construct(
        private readonly MailerInterface $mailer,
        string $name = null
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Construisez votre e-mail
        $email = (new Email())
            ->from('no-reply@bubblebook.fun')          // Doit être vérifié dans SES
            ->to('basile08@hotmail.fr')                // Votre adresse de test
            ->subject('Test d’envoi via SES depuis EC2')
            ->text('✅ Bravo ! Votre configuration Mailer fonctionne.');

        // Envoyez-le
        try {
            $this->mailer->send($email);
            $output->writeln('<info>✅ Email de test envoyé avec succès !</info>');
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $output->writeln(sprintf(
                '<error>❌ Échec de l’envoi : %s</error>',
                $e->getMessage()
            ));
            return Command::FAILURE;
        }
    }
}
