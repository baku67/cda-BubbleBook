<?php
namespace App\Jobs;

use App\Entity\User\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CleanExpiredRefreshTokensCommand extends Command
{
    protected static $defaultName = 'app:clean-expired-tokens';

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $repository = $this->entityManager->getRepository(RefreshToken::class);
        $expiredTokens = $repository->createQueryBuilder('rt')
            ->where('rt.expiresAt < :now')
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();

        foreach ($expiredTokens as $token) {
            $this->entityManager->remove($token);
        }

        $this->entityManager->flush();

        $output->writeln('Expired tokens cleaned successfully.');
        return Command::SUCCESS;
    }
}
