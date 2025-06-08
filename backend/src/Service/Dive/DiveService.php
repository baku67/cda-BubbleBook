<?php
namespace App\Service\Dive;

use App\DTO\Request\AddDiveDTO;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use App\Entity\Dive\Dive;
use Doctrine\ORM\EntityManagerInterface;
use DomainException;

class DiveService
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function addDiveToDivelog(Divelog $divelog, AddDiveDTO $dto, User $user): Dive
    {
        if ($divelog->getOwner()->getId() !== $user->getId()) {
            throw new DomainException('Access denied to this divelog.');
        }

        $dive = new Dive();
        $dive->setDivelog($divelog);
        $dive->setTitle($dto->title);
        $dive->setDescription($dto->description);
        $dive->setDiveDatetime(new \DateTime());

        $this->em->persist($dive);
        $this->em->flush();

        return $dive;
    }
}
