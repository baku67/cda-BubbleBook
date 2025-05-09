<?php

namespace App\Entity\Dive;

use App\Repository\Dive\DecompressionStopRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DecompressionStopRepository::class)]
class DecompressionStop
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $depth = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $duration = null;

    #[ORM\ManyToOne(inversedBy: 'decompressionStops')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Dive $dive = null;

    // En minutes depuis le début de la plongée:
    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $timeOffset = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDepth(): ?int
    {
        return $this->depth;
    }

    public function setDepth(int $depth): static
    {
        $this->depth = $depth;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDive(): ?Dive
    {
        return $this->dive;
    }

    public function setDive(?Dive $dive): static
    {
        $this->dive = $dive;

        return $this;
    }

    public function getTimeOffset(): ?int
    {
        return $this->timeOffset;
    }

    public function setTimeOffset(int $timeOffset): static
    {
        $this->timeOffset = $timeOffset;

        return $this;
    }
}
