<?php

namespace App\DataFixtures;
use App\Entity\User;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Utilisateur 1 (Vérifié, pas de 2FA, [user, admin])
        $user = new User();
        $user->setUsername("admin");
        $user->setEmail("admin@admin.com");
        $user->setPassword("admin");
        $user->setVerified(true);
        $user->set2fa(false);
        $user->setRoles(["user", "admin"]);
        $manager->persist($user);


        // Utilisateur 1 (Non vérifié, pas de 2FA, [user, admin])
        $user1 = new User();
        $user1->setUsername("admin1");
        $user1->setEmail("admin1@admin1.com");
        $user1->setPassword("admin1");
        $user1->setVerified(false);
        $user1->set2fa(false);
        $user1->setRoles(["user", "admin"]);
        $manager->persist($user1);

        $manager->flush();
    }
}
