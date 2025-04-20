<?php

namespace App\DataFixtures;

use App\Entity\Divelog\DiveTag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class DiveTagFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Liste des tags par défaut
        $names = [
            'Night',
            'Wreck',
            'Current',
            'Ice',
            'Cave',
            'Reef',
            'Wall',
            'Open sea',
            'Deep',
            'Drift',
            'Solo',
            'Photography',

            'Lake',
            'Quarry', // Carrière/Gravière
            'Pool',
            'RIB', // RIB = "Rigid Inflatable Boat" (zodiac)
            'Shore', // Plage
            'Boat',
            'Liveaboard', // Croisière
            
            // 'Macro', // prévoir catégories de tag pour la faune/flore ? Ajouter quand même ici ?
            // 'Big fish' // prévoir catégories de tag pour la faune/flore ? Ajouter quand même ici ?
        ];

        foreach ($names as $name) {
            $tag = new DiveTag();
            $tag->setName($name);
            $manager->persist($tag);
        }

        $manager->flush();
    }
}
