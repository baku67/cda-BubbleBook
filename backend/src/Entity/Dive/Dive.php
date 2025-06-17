<?php

namespace App\Entity\Dive;

use App\Enum\DiveOxygenMode;
use App\Enum\DiveVisibility;
use App\Entity\Dive\DiveTag;
use App\Entity\Divelog\Divelog;
use App\Repository\Dive\DiveRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DiveRepository::class)]
class Dive
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?float $temperature = null;

    #[ORM\Column(nullable: true, enumType: DiveVisibility::class)]
    private ?DiveVisibility $visibility = null;

    #[ORM\Column(nullable: true)] // note sur 10, mieux que juste ":(", ":/", ":)"  
    private ?int $satisfaction = null;

    /**
     * @var Collection<int, DiveTag>
     */
    #[ORM\ManyToMany(targetEntity: DiveTag::class)]
    private Collection $diveTags;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $diveDatetime = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $diveDuration = null;

    #[ORM\Column(type: Types::FLOAT ,nullable: true)]
    private ?float $weight = null;

    #[ORM\ManyToOne(inversedBy: 'dives')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Divelog $divelog = null;

    #[ORM\Column(type: Types::FLOAT)]
    private ?float $maxDepth = null;

    #[ORM\Column(enumType: DiveOxygenMode::class)]
    private ?DiveOxygenMode $oxygenMode = null;

    // Mélange d'O2 si oxygenMode = MIX
    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $oxygenMix = null;

    // palier de sécurité (default true)
    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => true])]
    private ?bool $safetyStop = null;

    /**
     * @var Collection<int, DecompressionStop>
     */
    #[ORM\OneToMany(targetEntity: DecompressionStop::class, mappedBy: 'dive', orphanRemoval: true)]
    private Collection $decompressionStops;

    public function __construct()
    {
        $this->diveTags = new ArrayCollection();
        $this->decompressionStops = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getTemperature(): ?int
    {
        return $this->temperature;
    }

    public function setTemperature(?int $temperature): static
    {
        $this->temperature = $temperature;

        return $this;
    }

    public function getVisibility(): ?DiveVisibility
    {
        return $this->visibility;
    }

    public function setVisibility(?DiveVisibility $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getSatisfaction(): ?int
    {
        return $this->satisfaction;
    }

    public function setSatisfaction(?int $satisfaction): static
    {
        $this->satisfaction = $satisfaction;

        return $this;
    }

    /**
     * @return Collection<int, DiveTag>
     */
    public function getDiveTags(): Collection
    {
        return $this->diveTags;
    }

    public function addDiveTag(DiveTag $diveTag): static
    {
        if (!$this->diveTags->contains($diveTag)) {
            $this->diveTags->add($diveTag);
        }

        return $this;
    }

    public function removeDiveTag(DiveTag $diveTag): static
    {
        $this->diveTags->removeElement($diveTag);

        return $this;
    }

    public function getDiveDatetime(): ?\DateTimeInterface
    {
        return $this->diveDatetime;
    }

    public function setDiveDatetime(\DateTimeInterface $diveDatetime): static
    {
        $this->diveDatetime = $diveDatetime;

        return $this;
    }

    public function getDiveDuration(): ?int
    {
        return $this->diveDuration;
    }

    public function setDiveDuration(int $diveDuration): static
    {
        $this->diveDuration = $diveDuration;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function getDivelog(): ?Divelog
    {
        return $this->divelog;
    }

    public function setDivelog(?Divelog $divelog): static
    {
        $this->divelog = $divelog;

        return $this;
    }

    public function getMaxDepth(): ?float
    {
        return $this->maxDepth;
    }

    public function setMaxDepth(?float $maxDepth): static
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    public function getOxygenMode(): ?DiveOxygenMode
    {
        return $this->oxygenMode;
    }

    public function setOxygenMode(DiveOxygenMode $oxygenMode): static
    {
        // Si le mode d'oxygen est diiférent de "MIX" ou "NITROX" (soit AIR), on a pas de valeur de mélange
        $this->oxygenMode = $oxygenMode;
        if ($oxygenMode == DiveOxygenMode::AIR) {
            $this->oxygenMix = null;
        }
        return $this;
    }

    // Mélange d'O2 si oxygenMode = MIX ou NITROX
    public function getOxygenMix(): ?float
    {
        return $this->oxygenMix;
    }

    public function setOxygenMix(?float $oxygenMix): static
    {
        $this->oxygenMix = $oxygenMix;

        return $this;
    }

    public function isSafetyStop(): ?bool
    {
        return $this->safetyStop;
    }

    public function setSafetyStop(bool $safetyStop): static
    {
        $this->safetyStop = $safetyStop;

        return $this;
    }

    /**
     * @return Collection<int, DecompressionStop>
     */
    public function getDecompressionStops(): Collection
    {
        return $this->decompressionStops;
    }

    public function addDecompressionStop(DecompressionStop $decompressionStop): static
    {
        if (!$this->decompressionStops->contains($decompressionStop)) {
            $this->decompressionStops->add($decompressionStop);
            $decompressionStop->setDive($this);
        }

        return $this;
    }

    public function removeDecompressionStop(DecompressionStop $decompressionStop): static
    {
        if ($this->decompressionStops->removeElement($decompressionStop)) {
            // set the owning side to null (unless already changed)
            if ($decompressionStop->getDive() === $this) {
                $decompressionStop->setDive(null);
            }
        }

        return $this;
    }
}
