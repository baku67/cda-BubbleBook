<?php
namespace tests\Integration;

use App\DataFixtures\UserFixtures;
use App\DataFixtures\UserCertificateFixtures;
use App\Entity\Certificate\UserCertificate;
use App\Entity\User\User;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCertificateRepositoryTest extends KernelTestCase
{
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        // Démarrer Symfony en env "test"
        self::bootKernel();
        $container = static::getContainer();
        $this->em = $container->get(EntityManagerInterface::class);

        // Purge la BDD de test
        $purger = new ORMPurger($this->em);
        $purger->purge();

        // Chargement des fixtures 
        $loader = new Loader();
        $passwordHasher = $container->get(UserPasswordHasherInterface::class);
        $loader->addFixture(new UserFixtures($passwordHasher));
        $loader->addFixture(new UserCertificateFixtures());

        $executor = new ORMExecutor($this->em, $purger);
        $executor->execute($loader->getFixtures());

        $this->em = $container->get(EntityManagerInterface::class);
    }

    public function testFindByUserReturnsExpectedCertificates(): void
    {
        // Récupère l'User créé par UserFixtures
        /** @var User $fixtureUser */
        $fixtureUser = $this->em
            ->getRepository(User::class)
            ->findOneBy(['email' => 'fixture.user@example.com']);

        $userCertificates = $this->em
            ->getRepository(UserCertificate::class)
            ->findBy(['user' => $fixtureUser]);

        $this->assertCount(1, $userCertificates, 'Une seule certification doit exister');
        $this->assertSame('Open Water Diver', $userCertificates[0]->getCertificate()->getName());
    }
}
