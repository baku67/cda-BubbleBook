<?php
namespace App\Service\Dive;

use App\DTO\Request\AddDiveDTO;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use App\Entity\Dive\Dive;
use App\Enum\DiveOxygenMode;
use App\Enum\DiveVisibility;
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
        $oxygenModeEnum = DiveOxygenMode::from($infos->getOxygenMode());
        $dive->setOxygenMode($oxygenModeEnum);
        // OxygenMix : uniquement si MIX ou NITROX
        if ($oxygenModeEnum === DiveOxygenMode::MIX || $oxygenModeEnum === DiveOxygenMode::NITROX) {
            $dive->setOxygenMix($infos->getOxygenMix());
        } else {
            $dive->setOxygenMix(null);
        }

        // Etat palier de sécurité
        $dive->setSafetyStop($infos->isSafetyStop());
        // Poids
        $dive->setWeight($infos->getWeight());

        // Température (facultative, ?? null redondant car déja ?float dans DTO)
        $dive->setTemperature($infos->getTemperature());

        // Visibilité (facultative, ?? null redondant car déja ?float dans DTO)
        $visibilityEnum = DiveVisibility::from($infos->getVisibility());
        $dive->setVisibility($visibilityEnum);

        $dive->setDiveDatetime(new \DateTime());

        $this->em->persist($dive);
        $this->em->flush();

        return $dive;
    }
}
