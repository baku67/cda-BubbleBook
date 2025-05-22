<?php

namespace App\DataFixtures;

use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class FriendshipFixtures extends Fixture implements DependentFixtureInterface
{
    public const FRIENDSHIP_1_REFERENCE = 'friendship-1';
    public const FRIENDSHIP_2_REFERENCE = 'friendship-2';

    public function load(ObjectManager $manager): void
    {
        // Récupération des utilisateurs fixtures
        $admin = $this->getReference(UserFixtures::USER_0_REFERENCE, User::class);
        $user1 = $this->getReference(UserFixtures::USER_1_REFERENCE, User::class);
        $user2 = $this->getReference(UserFixtures::USER_2_REFERENCE, User::class);

        // 1. Demande en attente entre user1 et admin
        $f1 = new Friendship($user1, $admin);
        // le constructeur définit déjà le status en PENDING, mais on s'assure :
        $f1->setStatus(FriendshipStatus::ACCEPTED);
        $manager->persist($f1);
        $this->addReference(self::FRIENDSHIP_1_REFERENCE, $f1);

        // 2. Relation acceptée entre user2 et admin
        $f2 = new Friendship($user2, $admin);
        $f2->setStatus(FriendshipStatus::PENDING);
        $manager->persist($f2);
        $this->addReference(self::FRIENDSHIP_2_REFERENCE, $f2);

        // Flush final
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
