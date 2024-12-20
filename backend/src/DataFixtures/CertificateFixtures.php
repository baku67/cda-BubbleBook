<?php

namespace App\DataFixtures;

use App\Entity\Certificate;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CertificateFixtures extends Fixture
{
    public const CERTIFICAT_OPEN_WATER_REFERENCE = 'certificat-open-water';
    public const CERTIFICAT_ADVANCED_OPEN_WATER_REFERENCE = 'certificat-advanced-open-water';
    public const CERTIFICAT_DEEP_REFERENCE = 'certificat-deep';
    public const CERTIFICAT_NITROX_REFERENCE = 'certificat-nitrox';
    public const CERTIFICAT_NIVEAU_1_REFERENCE = 'certificat-niveau-1';
    public const CERTIFICAT_NIVEAU_2_REFERENCE = 'certificat-niveau-2';
    public const CERTIFICAT_NIVEAU_3_REFERENCE = 'certificat-niveau-3';

    public function load(ObjectManager $manager): void
    {
        $certificats = [
            // PADI
            ['name' => 'Open Water', 'type' => 'PADI', 'reference' => self::CERTIFICAT_OPEN_WATER_REFERENCE],
            ['name' => 'Advanced Open Water', 'type' => 'PADI', 'reference' => self::CERTIFICAT_ADVANCED_OPEN_WATER_REFERENCE],
            ['name' => 'Deep', 'type' => 'PADI', 'reference' => self::CERTIFICAT_DEEP_REFERENCE],
            ['name' => 'Nitrox', 'type' => 'PADI', 'reference' => self::CERTIFICAT_NITROX_REFERENCE],
            // FFESSM
            ['name' => 'Niveau 1', 'type' => 'FFESSM', 'reference' => self::CERTIFICAT_NIVEAU_1_REFERENCE],
            ['name' => 'Niveau 2', 'type' => 'FFESSM', 'reference' => self::CERTIFICAT_NIVEAU_2_REFERENCE],
            ['name' => 'Niveau 3', 'type' => 'FFESSM', 'reference' => self::CERTIFICAT_NIVEAU_3_REFERENCE],
        ];

        foreach ($certificats as $certData) {
            $certificat = new Certificate();
            $certificat->setName($certData['name']);
            $certificat->setType($certData['type']);
            $manager->persist($certificat);
            $this->addReference($certData['reference'], $certificat);
        }

        $manager->flush();
    }
}
