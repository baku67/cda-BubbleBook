<?php
namespace App\DataFixtures;

use App\Entity\Role;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RoleFixtures extends Fixture
{
    public const ROLE_USER_REFERENCE = 'role-user';
    public const ROLE_ADMIN_REFERENCE = 'role-admin';
    public const ROLE_DIVER_REFERENCE = 'role-diver';
    public const ROLE_CLUB_REFERENCE = 'role-club';
    
    public function load(ObjectManager $manager): void
    {
        $roleUser = new Role();
        $roleUser->setName('ROLE_USER');
        $manager->persist($roleUser);
        $this->addReference(self::ROLE_USER_REFERENCE, $roleUser);

        $roleDiver = new Role();
        $roleDiver->setName('ROLE_DIVER');
        $manager->persist($roleDiver);
        $this->addReference(self::ROLE_DIVER_REFERENCE, $roleDiver);

        $roleClub = new Role();
        $roleClub->setName('ROLE_CLUB');
        $manager->persist($roleClub);
        $this->addReference(self::ROLE_CLUB_REFERENCE, $roleClub);

        $roleAdmin = new Role();
        $roleAdmin->setName('ROLE_ADMIN');
        $manager->persist($roleAdmin);
        $this->addReference(self::ROLE_ADMIN_REFERENCE, $roleAdmin);

        $manager->flush();
    }
}
