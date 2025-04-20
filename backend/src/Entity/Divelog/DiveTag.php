<?php

namespace App\Entity\Divelog;

use App\Repository\Divelog\DiveTagRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DiveTagRepository::class)]
class DiveTag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
