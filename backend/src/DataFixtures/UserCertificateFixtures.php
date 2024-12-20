<?php

namespace App\DataFixtures;

use App\Entity\Certificate;
use App\Entity\User;
use App\Entity\UserCertificate;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class UserCertificateFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $userCertificats = [
            [
                'userReference' => UserFixtures::USER_0_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_OPEN_WATER_REFERENCE,
                'obtainedAt' => '2023-12-01 10:00:00'
            ],
            [
                'userReference' => UserFixtures::USER_0_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_NIVEAU_1_REFERENCE,
                'obtainedAt' => '2023-12-05 12:00:00'
            ],
            [
                'userReference' => UserFixtures::USER_1_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_ADVANCED_OPEN_WATER_REFERENCE,
                'obtainedAt' => '2023-12-10 14:00:00'
            ],
            [
                'userReference' => UserFixtures::USER_2_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_DEEP_REFERENCE,
                'obtainedAt' => '2023-12-15 16:00:00'
            ],
        ];

        foreach ($userCertificats as $data) {
            $userCertificat = new UserCertificate();
            $userCertificat->setUser($this->getReference($data['userReference'], User::class));
            $userCertificat->setCertificate($this->getReference($data['certificatReference'], Certificate::class));
            $userCertificat->setObtainedAt(new \DateTimeImmutable($data['obtainedAt']));
            $manager->persist($userCertificat);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            CertificateFixtures::class,
        ];
    }
}
