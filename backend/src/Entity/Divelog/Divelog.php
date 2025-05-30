<?php

namespace App\Entity\Divelog;

use App\Entity\User\User;
use App\Entity\Dive\Dive;
use App\Repository\Divelog\DivelogRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DivelogRepository::class)]
class Divelog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255, nullable: false, options: ["default" => "blue"])] // default ?
    private ?string $theme = null;

    /**
     * @var Collection<int, Dive>
     */
    #[ORM\OneToMany(
        targetEntity: Dive::class, 
        mappedBy: 'divelog', 
        orphanRemoval: true,
        cascade: ['remove']
    )]
    private Collection $dives;

    #[ORM\ManyToOne(inversedBy: 'divelogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $displayOrder = null;

    public function __construct()
    {
        $this->dives = new ArrayCollection();
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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getTheme(): ?string
    {
        return $this->theme;
    }

    public function setTheme(string $theme): static
    {
        $this->theme = $theme;

        return $this;
    }

    /**
     * @return Collection<int, Dive>
     */
    public function getDives(): Collection
    {
        return $this->dives;
    }

    public function addDive(Dive $dive): static
    {
        if (!$this->dives->contains($dive)) {
            $this->dives->add($dive);
            $dive->setDivelog($this);
        }

        return $this;
    }

    public function removeDive(Dive $dive): static
    {
        if ($this->dives->removeElement($dive)) {
            // set the owning side to null (unless already changed)
            if ($dive->getDivelog() === $this) {
                $dive->setDivelog(null);
            }
        }

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getDisplayOrder(): ?int
    {
        return $this->displayOrder;
    }

    public function setDisplayOrder(int $displayOrder): static
    {
        $this->displayOrder = $displayOrder;

        return $this;
    }
}
