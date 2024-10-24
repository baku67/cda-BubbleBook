<?php
namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Pour que le JWT stock la donnée email au lieu de username 

        // Récupère l'utilisateur actuel
        $user = $event->getUser();
        if (!$user instanceof User) {
            return;
        }
        $data = $event->getData();
        $data['username'] = $user->getEmail();
        $event->setData($data);
    }
}
