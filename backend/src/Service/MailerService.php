<?php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerService
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendConfirmationEmail(string $to, string $token): void
    {
        $email = (new Email())
            ->from('noreply@yourapp.com')
            ->to($to)
            ->subject('Confirmez votre inscription')
            ->html('<p>Merci de vous être inscrit ! Cliquez sur ce lien pour confirmer votre inscription : <a href="http://localhost:4200/confirm-email?token=' . $token . '&emailAddress=' . $to . '">Confirmer</a></p>');

        $this->mailer->send($email);
    }
}