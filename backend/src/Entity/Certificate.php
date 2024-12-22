<?php

namespace App\Entity;

use App\Repository\CertificateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: CertificateRepository::class)]
class Certificate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    /**
     * @var Collection<int, UserCertificate>
     */
    #[ORM\OneToMany(targetEntity: UserCertificate::class, mappedBy: 'certificate', orphanRemoval: true)]
    #[Ignore] // Ignore cette propriété lors de la sérialisation (fix circular reference) + utilisation de DTO dans le controller, on s'en moque de récupérer les utilisateurs qui possède ce certificat
    private Collection $userCertificates;

    public function __construct()
    {
        $this->userCertificates = new ArrayCollection();
    }

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection<int, UserCertificate>
     */
    public function getUserCertificates(): Collection
    {
        return $this->userCertificates;
    }

    public function addUserCertificate(UserCertificate $userCertificate): static
    {
        if (!$this->userCertificates->contains($userCertificate)) {
            $this->userCertificates->add($userCertificate);
            $userCertificate->setCertificate($this);
        }

        return $this;
    }

    public function removeUserCertificate(UserCertificate $userCertificate): static
    {
        if ($this->userCertificates->removeElement($userCertificate)) {
            // set the owning side to null (unless already changed)
            if ($userCertificate->getCertificate() === $this) {
                $userCertificate->setCertificate(null);
            }
        }

        return $this;
    }
}
