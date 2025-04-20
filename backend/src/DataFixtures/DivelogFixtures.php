<?php

namespace App\DataFixtures;

use App\DataFixtures\UserFixtures;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class DivelogFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupère les utilisateurs créés dans UserFixtures
        $users = [
            $this->getReference(UserFixtures::USER_0_REFERENCE, User::class),
            $this->getReference(UserFixtures::USER_1_REFERENCE, User::class),
            $this->getReference(UserFixtures::USER_2_REFERENCE, User::class),
        ];

        // Thèmes possibles pour les carnets
        $themes = [
            'red',
            'blue',
            'green',
            'white',
        ];

        foreach ($users as $userIndex => $user) {
            // Nombre aléatoire de Divelogs par utilisateur (2 à 4)
            $divelogCount = random_int(2, 4);

            for ($i = 1; $i <= $divelogCount; $i++) {
                $divelog = new Divelog();
                $divelog
                    ->setTitle(sprintf('Carnet %d-%d', $userIndex + 1, $i))
                    ->setDescription(sprintf('Description du carnet %d-%d', $userIndex + 1, $i))
                    ->setCreatedAt(new \DateTimeImmutable(sprintf('-%d days', random_int(0, 365))))
                    ->setTheme($themes[array_rand($themes)])
                    ->setOwner($user);

                $manager->persist($divelog);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
