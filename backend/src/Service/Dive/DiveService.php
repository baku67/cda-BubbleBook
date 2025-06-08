<?php
namespace App\Service\Dive;

use App\DTO\Request\AddDiveDTO;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use App\Entity\Dive\Dive;
use App\Enum\DiveOxygenMode;
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

        $infos = $dto->getInfos();

        $dive = new Dive();
        $dive->setDivelog($divelog);
        $dive->setTitle($infos->getTitle());
        $dive->setDescription($infos->getDescription());
        $dive->setDiveDuration($infos->getDuration());
        $dive->setMaxDepth($infos->getMaxDepth());

        // Conversion string → enum DiveOxygenMode
        $modeEnum = DiveOxygenMode::from($infos->getOxygenMode());
        $dive->setOxygenMode($modeEnum);
        // OxygenMix : uniquement si MIX
        if ($modeEnum === DiveOxygenMode::MIX) {
            $dive->setOxygenMix($infos->getOxygenMix());
        } else {
            $dive->setOxygenMix(null);
        }

        // Etat palier de sécurité
        $dive->setSafetyStop($infos->isSafetyStop());
        // Poids
        $dive->setWeight($infos->getWeight());


        $dive->setDiveDatetime(new \DateTime());

        $this->em->persist($dive);
        $this->em->flush();

        return $dive;
    }
}
