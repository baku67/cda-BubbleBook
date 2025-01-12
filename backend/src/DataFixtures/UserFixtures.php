<?php

namespace App\DataFixtures;

use App\Entity\Role;
use App\Entity\User;
use App\Enum\Avatar;
use App\Enum\Banner;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    public const USER_0_REFERENCE = 'user0';
    public const USER_1_REFERENCE = 'user1';
    public const USER_2_REFERENCE = 'user2';
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher) 
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 0 (Vérifié, DIVER, pas de 2FA, !![ADMIN]!!, FRA)
        $user0 = new User();
        $user0->setUsername("admin");
        $user0->setEmail("admin@admin.com");
        $user0->setPassword($this->passwordHasher->hashPassword($user0, "admin"));
        $user0->setVerified(true);
        $user0->setAccountType("option-diver");
        $user0->set2fa(false);
        $user0->setNationality("FRA");
        $user0->setAvatarUrl($this->getRandomEnumValue(Avatar::class));
        $user0->setBannerUrl($this->getRandomEnumValue(Banner::class));
        $user0->setFirstLoginStep(null); // pas obligatoire parce defaut null en BDD
        $user0->addRole($this->getReference(RoleFixtures::ROLE_USER_REFERENCE, Role::class));
        $user0->addRole($this->getReference(RoleFixtures::ROLE_ADMIN_REFERENCE, Role::class));
        $manager->persist($user0);
        $this->addReference(self::USER_0_REFERENCE, $user0);


        // 1 (Non vérifié, DIVER, no 2FA, [user], DZA)
        $user1 = new User();
        $user1->setUsername("user1");
        $user1->setEmail("user1@user1.com");
        $user1->setPassword($this->passwordHasher->hashPassword($user1, "user1"));
        $user1->setVerified(false);
        $user1->setAccountType("option-diver");
        $user1->set2fa(is2fa: false);
        $user1->setNationality("DZA");
        $user1->setAvatarUrl($this->getRandomEnumValue(Avatar::class));
        $user1->setBannerUrl($this->getRandomEnumValue(Banner::class)); 
        $user1->setFirstLoginStep(null); // pas obligatoire parce defaut null en BDD
        $user1->addRole($this->getReference(RoleFixtures::ROLE_USER_REFERENCE, Role::class));
        $user1->addRole($this->getReference(RoleFixtures::ROLE_ADMIN_REFERENCE, Role::class));
        $manager->persist($user1);
        $this->addReference(self::USER_1_REFERENCE, $user0);

        // 2 (Non vérifié, CLUB, pas de 2FA, [user], pas de nationality)
        $user2 = new User();
        $user2->setUsername("user2");
        $user2->setEmail("user2@user2.com");
        $user2->setPassword($this->passwordHasher->hashPassword($user2, "user2"));
        $user2->setVerified(false);
        $user2->setAccountType("option-club");
        $user2->set2fa(is2fa: false);
        $user2->setNationality(null);
        $user2->setAvatarUrl($this->getRandomEnumValue(Avatar::class));
        $user2->setBannerUrl($this->getRandomEnumValue(Banner::class)); 
        $user2->setFirstLoginStep(2); // pas obligatoire parce defaut null en BDD
        $user2->addRole($this->getReference(RoleFixtures::ROLE_USER_REFERENCE, Role::class));
        $manager->persist($user2);
        $this->addReference(self::USER_2_REFERENCE, $user0);

        $manager->flush();
    }


    /**
     * Retourne une valeur aléatoire d'une enum.
     */
    private function getRandomEnumValue(string $enumClass): string
    {
        $cases = $enumClass::cases();
        return $cases[array_rand($cases)]->value;
    }


    public function getDependencies(): array
    {
        return [
            RoleFixtures::class,
        ];
    }
}
