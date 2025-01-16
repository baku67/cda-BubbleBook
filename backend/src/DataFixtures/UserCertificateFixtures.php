<?php
namespace App\DataFixtures;

use App\Entity\Certificate\Certificate;
use App\Entity\User\User;
use App\Entity\Certificate\UserCertificate;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class UserCertificateFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $userCertificates = [
            [
                'userReference' => UserFixtures::USER_0_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_OPEN_WATER_REFERENCE,
                'obtainedDate' => '2023-12-02 10:00:00',
                'location' => 'Strasbourg'
            ],
            [
                'userReference' => UserFixtures::USER_0_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_NIVEAU_1_REFERENCE,
                'obtainedDate' => '2022-08-05 12:00:00',
                'location' => 'Egypte'
            ],
            [
                'userReference' => UserFixtures::USER_1_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_ADVANCED_OPEN_WATER_REFERENCE,
                'obtainedDate' => '2020-12-10 14:00:00',
                'location' => 'Greenland'
            ],
            [
                'userReference' => UserFixtures::USER_2_REFERENCE,
                'certificatReference' => CertificateFixtures::CERTIFICAT_DEEP_REFERENCE,
                'obtainedDate' => '2018-10-25 16:00:00',
                'location' => 'Bretagne'
            ],
        ];

        foreach ($userCertificates as $data) {
            $userCertificat = new UserCertificate();
            $userCertificat->setUser($this->getReference($data['userReference'], User::class));
            $userCertificat->setCertificate($this->getReference($data['certificatReference'], Certificate::class));
            $userCertificat->setObtainedDate(new \DateTimeImmutable($data['obtainedDate']));
            $userCertificat->setLocation($data['location']);
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
