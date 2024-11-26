<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Nullable pour le register() mais go default généré()
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    private ?bool $isVerified = null;

    #[ORM\Column]
    private ?bool $is2fa = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $confirmationToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $confirmationTokenExpiry = null;


    /**
     * @var Collection<int, Role>
     */
    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    private Collection $roles;


    public function __construct()
    {
        $this->roles = new ArrayCollection();
    }



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function is2fa(): ?bool
    {
        return $this->is2fa;
    }

    public function set2fa(bool $is2fa): static
    {
        $this->is2fa = $is2fa;

        return $this;
    }




    // OBLIGE PAR UserInterface
    // Remplace getUsername() par getUserIdentifier() 
    public function getUserIdentifier(): string
    {
        return $this->email;  // Utilise l'email comme identifiant unique
    }

    

    // OBLIGE PAR PasswordAuthenticatedUserInterface (je crois)
    public function getSalt(): ?string
    {
        // Pas besoin de salt si on utilise bcrypt/argon2i
        return null;
    }

    public function eraseCredentials()
    {
        // Si tu stockes des données sensibles temporaires, les effacer ici
    }

    public function getConfirmationToken(): ?string
    {
        return $this->confirmationToken;
    }

    public function setConfirmationToken(?string $confirmationToken): static
    {
        $this->confirmationToken = $confirmationToken;

        return $this;
    }

    public function getConfirmationTokenExpiry(): ?\DateTimeInterface
    {
        return $this->confirmationTokenExpiry;
    }

    public function setConfirmationTokenExpiry(?\DateTimeInterface $confirmationTokenExpiry): static
    {
        $this->confirmationTokenExpiry = $confirmationTokenExpiry;

        return $this;
    }

    /**
     *
     * @return string[]
     */
    public function getRoles(): array
    {
        $roles = [];

        foreach ($this->roles as $role) {
            $roles[] = $role->getName();
        }

        // Assure qu'au moins un rôle par défaut est toujours présent
        $roles[] = 'ROLE_USER';

        // Élimine les doublons au cas où
        return array_unique($roles);
    }

    public function addRole(Role $role): static
    {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
        }

        return $this;
    }

    public function removeRole(Role $role): static
    {
        $this->roles->removeElement($role);

        return $this;
    }

}
