<?php

namespace App\DataFixtures;

use App\Entity\Role;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Utilisateur 1 (Vérifié, pas de 2FA, [user])
        $user = new User();
        $user->setUsername("admin");
        $user->setEmail("admin@admin.com");
        $user->setPassword("admin");
        $user->setVerified(true);
        $user->set2fa(false);
        // Ajout des rôles à partir des références
        $user->addRole($this->getReference(RoleFixtures::ROLE_USER_REFERENCE, Role::class));
        $manager->persist($user);


        // Utilisateur 1 (Non vérifié, pas de 2FA, [user, admin])
        $user1 = new User();
        $user1->setUsername("admin1");
        $user1->setEmail("admin1@admin1.com");
        $user1->setPassword("admin1");
        $user1->setVerified(false);
        $user1->set2fa(false);
        // Ajout des rôles à partir des références
        $user1->addRole($this->getReference(RoleFixtures::ROLE_USER_REFERENCE, Role::class));
        $user1->addRole($this->getReference(RoleFixtures::ROLE_ADMIN_REFERENCE, Role::class));
        $manager->persist($user1);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            RoleFixtures::class,
        ];
    }
}
