<?php
namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;


class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Récupère l'utilisateur actuel
        $user = $event->getUser();
        if (!$user instanceof User) {
            return;
        }

        // Modifie le contenu du JWT pour inclure l'email
        $data = $event->getData();
        $data['username'] = $user->getEmail();
        $event->setData($data);
    }
}
