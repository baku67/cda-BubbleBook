<?php

namespace App\Entity\Dive;

use App\Enum\Visibility;
use App\Entity\Dive\DiveTag;
use App\Entity\Divelog\Divelog;
use App\Repository\Divelog\DiveRepository;
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
    private ?int $temperature = null;

    #[ORM\Column(nullable: true, enumType: Visibility::class)]
    private ?Visibility $visibility = null;

    #[ORM\Column(nullable: true)]
    private ?int $satisfaction = null;

    #[ORM\ManyToOne(inversedBy: 'dives')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Divelog $divelog = null;

    /**
     * @var Collection<int, DiveTag>
     */
    #[ORM\ManyToMany(targetEntity: DiveTag::class)]
    private Collection $diveTags;

    public function __construct()
    {
        $this->diveTags = new ArrayCollection();
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

    public function getVisibility(): ?Visibility
    {
        return $this->visibility;
    }

    public function setVisibility(?Visibility $visibility): static
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

    public function getDivelog(): ?Divelog
    {
        return $this->divelog;
    }

    public function setDivelog(?Divelog $divelog): static
    {
        $this->divelog = $divelog;

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
}
