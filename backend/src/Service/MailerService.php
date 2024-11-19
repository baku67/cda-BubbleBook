<?php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerService
{
    private MailerInterface $mailer;
    // reçu depuis service.yaml %env% :
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
            ->from('noreply@yourapp.com')
            ->to($to)
            ->subject('Confirmez votre inscription')
            ->html('<p>Merci de vous être inscrit ! Cliquez sur ce lien pour confirmer votre inscription : <a href="' . $confirmationUrl . '">Confirmer</a></p>');

        $this->mailer->send($email);
    }
}