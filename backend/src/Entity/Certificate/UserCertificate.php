<?php
namespace App\Entity\Certificate;

use App\Entity\User\User;
use App\Repository\UserCertificateRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserCertificateRepository::class)]
class UserCertificate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'userCertificates')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Certificate::class, inversedBy: 'userCertificates')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Certificate $certificate = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $obtained_date = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $location = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getCertificate(): ?Certificate
    {
        return $this->certificate;
    }

    public function setCertificate(?Certificate $certificate): static
    {
        $this->certificate = $certificate;

        return $this;
    }

    public function getObtainedDate(): ?\DateTimeImmutable
    {
        return $this->obtained_date;
    }

    public function setObtainedDate(?\DateTimeImmutable $obtained_date): static
    {
        $this->obtained_date = $obtained_date;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }
}
