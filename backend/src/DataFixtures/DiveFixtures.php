<?php

namespace App\DataFixtures;

use App\DataFixtures\DivelogFixtures;
use App\DataFixtures\DiveTagFixtures; 
use App\Entity\Dive\Dive;
use App\Entity\Dive\DiveTag;
use App\Entity\Divelog\Divelog;
use App\Enum\DiveOxygenMode;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Enum\DiveVisibility;

class DiveFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupère tous les DiveTags existants
        $tags = $manager->getRepository(DiveTag::class)->findAll();

        // Récupère tous les Divelogs créés
        $divelogs = $manager->getRepository(Divelog::class)->findAll();

        foreach ($divelogs as $divelogIndex => $divelog) {
            // Nombre aléatoire de Dives par Divelog (5 à 67)
            $diveCount = random_int(5, 67);

            for ($j = 1; $j <= $diveCount; $j++) {
                $dive = new Dive();
                $dive
                    ->setTitle(sprintf('Plongée %d-%d', $divelogIndex + 1, $j))
                    ->setDescription(sprintf('Description de la plongée %d-%d', $divelogIndex + 1, $j))
                    ->setTemperature(random_int(18, 30))
                    ->setVisibility(DiveVisibility::cases()[array_rand(DiveVisibility::cases())])
                    ->setSatisfaction(random_int(1, 5))
                    ->setDivelog($divelog)
                    ->setDiveDatetime(
                        new \DateTimeImmutable(sprintf('2025-05-%02d 08:00:00', min(28, ($divelog->getId() * 3))) )
                    )
                    ->setDiveDuration(rand(30, 70))
                    ->setWeight(rand(2, 15))
                    ->setMaxDepth(random_int(5, 60))
                    ->setSafetyStop((bool) random_int(0, 1));

                // Mode oxygen (Air/Nitrox/Mix)
                $mode = DiveOxygenMode::cases()[array_rand(DiveOxygenMode::cases())];
                $dive->setOxygenMode($mode);    
                // Mix oxygen si MIX ou NITROX:  
                $dive->setOxygenMix(
                    $mode === DiveOxygenMode::MIX || $mode === DiveOxygenMode::NITROX
                        ? random_int(21, 99)
                        : null
                );
                   
                // Associer un sous-ensemble aléatoire de DiveTags
                if (!empty($tags)) {
                    shuffle($tags);
                    $tagCount = random_int(1, count($tags));
                    for ($k = 0; $k < $tagCount; $k++) {
                        $dive->addDiveTag($tags[$k]);
                    }
                }

                $manager->persist($dive);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            DivelogFixtures::class,
            DiveTagFixtures::class,
        ];
    }
}
