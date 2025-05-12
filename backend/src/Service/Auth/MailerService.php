<?php
namespace App\Service\Auth;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerService
{
    private MailerInterface $mailer;
    private string $frontendBaseUrl;

    public function __construct(MailerInterface $mailer, string $frontendBaseUrl)
    {
        $this->mailer = $mailer;
        $this->frontendBaseUrl = $frontendBaseUrl;
    }

    public function sendConfirmationEmail(string $to, string $token): void
    {
        $confirmationUrl = $this->frontendBaseUrl . '/confirm-email?token=' . $token . '&emailAddress=' . $to;
        
        $email = (new Email())
            ->from('noreply@bubblebook.fun')
            ->to($to)
            ->subject('Confirmez votre inscription')
            ->html('<p>Merci de vous être inscrit ! Cliquez sur ce lien pour confirmer votre inscription : <a href="' . $confirmationUrl . '">Confirmer</a></p>');

        $this->mailer->send($email);
    }

    public function sendPasswordModified(string $to): void
    {
        $email = (new Email())
            ->from('noreply@bubblebook.fun')
            ->to($to)
            ->subject('Mot de passe modifié')
            ->html('<p>Le mot de passe de votre compte Bubblebook vient d\'être modifié.</p>');

        $this->mailer->send($email);
    }
}