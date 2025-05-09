<?php

namespace App\DataFixtures;

use App\Entity\Dive\DecompressionStop;
use App\Entity\Dive\Dive;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class DecompressionStopFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $dives = $manager->getRepository(Dive::class)->findAll();

        foreach ($dives as $dive) {
            // Créer des paliers si la plongée est profonde
            if ($dive->getMaxDepth() > 20) {
                $stopCount = random_int(1, (int) ceil($dive->getMaxDepth() / 10));

                for ($i = 1; $i <= $stopCount; $i++) {
                    $stop = new DecompressionStop();
                    $stop
                        ->setDive($dive)
                        ->setDepth(
                            max(3, $dive->getMaxDepth() - $i * random_int(3, 5))
                        )
                        ->setDuration(random_int(1, 10))
                        ->setTimeOffset(random_int(15, 90));

                    $manager->persist($stop);
                }
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [DiveFixtures::class];
    }
}