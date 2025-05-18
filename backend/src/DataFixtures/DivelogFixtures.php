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

    private const THEMES = [
        'divelog-theme-1',
        'divelog-theme-2',
        'divelog-theme-3',
        'divelog-theme-4',
        'divelog-theme-5',
        'divelog-theme-6',
        'divelog-theme-7',
        'divelog-theme-8',
        'divelog-theme-9',
        'divelog-theme-10',
    ];


    public function load(ObjectManager $manager): void
    {
        // Récupère les utilisateurs créés dans UserFixtures
        $users = [
            $this->getReference(UserFixtures::USER_0_REFERENCE, User::class),
            $this->getReference(UserFixtures::USER_1_REFERENCE, User::class),
            $this->getReference(UserFixtures::USER_2_REFERENCE, User::class),
        ];

        // Jeu de données réaliste pour les divelogs
        $divelogsData = [
            [
                'userIndex' => 0,
                'entries' => [
                    [
                        'title' => 'Vacances Égypte 2022',
                        'description' => 'Exploration des récifs coralliens de la Mer Rouge près de Hurghada pendant 10 jours, observation de tortues marines et de poissons-perroquets.',
                        'createdAt' => new \DateTimeImmutable('2022-08-10'),
                        'displayOrder' => 1
                    ],
                    [
                        'title' => 'Croisière Galápagos 2023',
                        'description' => 'Découverte des Galápagos en bateau, plongées avec des bancs de poissons tropicaux et rencontre avec des requins-marteaux.',
                        'createdAt' => new \DateTimeImmutable('2023-09-05'),
                        'displayOrder' => 2
                    ],
                    [
                        'title' => 'Corse Printemps 2024',
                        'description' => 'Découverte des fonds marins clairs de la réserve de Scandola avec une faune variée.',
                        'createdAt' => new \DateTimeImmutable('2024-05-10'),
                        'displayOrder' => 3
                    ],
                ],
            ],
            [
                'userIndex' => 1,
                'entries' => [
                    [
                        'title' => 'Été Côte d’Azur 2023',
                        'description' => 'Immersion dans les calanques de Cassis, eaux turquoises et falaises majestueuses.',
                        'createdAt' => new \DateTimeImmutable('2023-07-20'),
                        'displayOrder' => 1
                    ],
                    [
                        'title' => 'Aventures Indonésie 2024',
                        'description' => 'Plongées à Komodo, observation des dragons et des raies manta géantes.',
                        'createdAt' => new \DateTimeImmutable('2024-03-15'),
                        'displayOrder' => 2
                    ],
                ],
            ],
            [
                'userIndex' => 2,
                'entries' => [
                    [
                        'title' => 'Corse Printemps 2024',
                        'description' => 'Découverte des fonds marins clairs de la réserve de Scandola avec une faune variée.',
                        'createdAt' => new \DateTimeImmutable('2024-05-10'),
                        'displayOrder' => 1
                    ],
                    [
                        'title' => 'Pâques Maldives 2023',
                        'description' => 'Séjour aux Maldives, plongées dans les atolls et rencontre avec des requins-baleines.',
                        'createdAt' => new \DateTimeImmutable('2023-04-02'),
                        'displayOrder' => 2
                    ],
                ],
            ],
        ];

        foreach ($divelogsData as $block) {
            $user = $users[$block['userIndex']];
            foreach ($block['entries'] as $item) {
                $divelog = new Divelog();
                $divelog->setOwner($user);
                $divelog->setTitle($item['title']);
                $divelog->setDescription($item['description']);
                $divelog->setCreatedAt($item['createdAt']);
                $divelog->setDisplayOrder($item['displayOrder']);
                
                $randomTheme = self::THEMES[array_rand(self::THEMES)];
                $divelog->setTheme($randomTheme);

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
