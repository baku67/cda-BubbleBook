<?php

namespace App\DataFixtures;

use App\DataFixtures\DivelogFixtures;
use App\Entity\Divelog\Dive;
use App\Entity\Divelog\Divelog;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Enum\Visibility;

class DiveFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupère tous les Divelogs créés
        $divelogs = $manager->getRepository(Divelog::class)->findAll();

        foreach ($divelogs as $divelogIndex => $divelog) {
            // Nombre aléatoire de Dives par Divelog (3 à 7)
            $diveCount = random_int(3, 7);

            for ($j = 1; $j <= $diveCount; $j++) {
                $dive = new Dive();
                $dive
                    ->setTitle(sprintf('Plongée %d-%d', $divelogIndex + 1, $j))
                    ->setDescription(sprintf('Description de la plongée %d-%d', $divelogIndex + 1, $j))
                    ->setTemperature(random_int(18, 30))
                    ->setVisibility(Visibility::cases()[array_rand(Visibility::cases())])
                    ->setSatisfaction(random_int(1, 5))
                    ->setDivelog($divelog);

                $manager->persist($dive);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            DivelogFixtures::class,
        ];
    }
}
