<?php
namespace App\EventListeners;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;


// Le JWTCreatedListener est un listener d'événement associé à lexik_jwt_authentication.on_jwt_created. Ce listener est déclenché lors de la création du token JWT, juste après l'authentification réussie, mais avant que le token ne soit signé.
// Rôle principal :
// - Modifier le contenu du payload JWT avant qu’il ne soit signé.
// - Ajouter des données supplémentaires au JWT, comme des informations sur l’utilisateur ou d’autres métadonnées.
class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Récupère l'utilisateur actuel
        $user = $event->getUser();
        if ($user instanceof User) {
            
        } else {
            return;
        }

        // Modifie le contenu du JWT pour inclure l'email
        
        $data['username'] = $user->getEmail();
        $event->setData($data);
    }
}
