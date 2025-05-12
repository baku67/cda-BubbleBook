<?php
namespace App\Entity\User;

use App\Entity\Certificate\UserCertificate;
use App\Entity\Divelog\Divelog;
use App\Enum\PrivacyOption;
use App\Repository\User\UserRepository;
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

    // username généré au register() (UsernameService)
    #[ORM\Column(length: 30, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $isVerified = false;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $is2fa = false;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $confirmationToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $confirmationTokenExpiry = null;

    /**
     * @var Collection<int, Role>
     */
    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    private Collection $roles;

    #[ORM\Column(length: 255, options: ['default' => 'option-diver'])]
    private ?string $accountType = 'option-diver';

    #[ORM\Column(length: 3, nullable: true)]
    private ?string $nationality = null;

    /**
     * @var Collection<int, UserCertificate>
     */
    #[ORM\OneToMany(
        targetEntity: UserCertificate::class, 
        mappedBy: 'user', 
        orphanRemoval: true,
        cascade: ['remove']
    )]
    private Collection $userCertificates;

    #[ORM\Column(length: 255, nullable: true, options: ['default' => 'assets/images/default/avatars/profil-picture-default-original.webp'])]
    private ?string $avatarUrl = 'assets/images/default/avatars/profil-picture-default-original.webp';

    #[ORM\Column(length: 255, nullable: true, options: ['default' => 'assets/images/default/banners/default-banner-00.webp'])]
    private ?string $bannerUrl = 'assets/images/default/banners/default-banner-00.webp';

    #[ORM\Column(nullable: true, options: ['default' => 1])]
    private ?int $firstLoginStep = 1;

    #[ORM\Column(nullable: true)]
    private ?int $initialDivesCount = null;

    #[ORM\Column(type: 'string', enumType: PrivacyOption::class, options: ['default' => PrivacyOption::ALL->value])]
    private PrivacyOption $profilPrivacy = PrivacyOption::ALL;

    #[ORM\Column(type: 'string', enumType: PrivacyOption::class, options: ['default' => PrivacyOption::NO_ONE->value])]
    private PrivacyOption $logBooksPrivacy = PrivacyOption::NO_ONE;

    #[ORM\Column(type: 'string', enumType: PrivacyOption::class, options: ['default' => PrivacyOption::NO_ONE->value])]
    private PrivacyOption $certificatesPrivacy = PrivacyOption::NO_ONE;

    #[ORM\Column(type: 'string', enumType: PrivacyOption::class, options: ['default' => PrivacyOption::NO_ONE->value])]
    private PrivacyOption $galleryPrivacy = PrivacyOption::NO_ONE;

    /**
     * @var Collection<int, Divelog>
     */
    #[ORM\OneToMany(
        targetEntity: Divelog::class, 
        mappedBy: 'owner', 
        orphanRemoval: true,
        cascade: ['remove']
    )]
    private Collection $divelogs;


    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->userCertificates = new ArrayCollection();
        $this->divelogs = new ArrayCollection();
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

    public function getAccountType(): ?string
    {
        return $this->accountType;
    }

    public function setAccountType(?string $accountType): static
    {
        $this->accountType = $accountType;

        return $this;
    }

    public function getNationality(): ?string
    {
        return $this->nationality;
    }

    public function setNationality(?string $nationality): static
    {
        $this->nationality = $nationality;

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
            $userCertificate->setUser($this);
        }

        return $this;
    }

    public function removeUserCertificate(UserCertificate $userCertificate): static
    {
        if ($this->userCertificates->removeElement($userCertificate)) {
            // set the owning side to null (unless already changed)
            if ($userCertificate->getUser() === $this) {
                $userCertificate->setUser(null);
            }
        }

        return $this;
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function setAvatarUrl(?string $avatarUrl): static
    {
        $this->avatarUrl = $avatarUrl;

        return $this;
    }

    public function getBannerUrl(): ?string
    {
        return $this->bannerUrl;
    }

    public function setBannerUrl(?string $bannerUrl): static
    {
        $this->bannerUrl = $bannerUrl;

        return $this;
    }

    public function getFirstLoginStep(): ?int
    {
        return $this->firstLoginStep;
    }

    public function setFirstLoginStep(?int $firstLoginStep): static
    {
        $this->firstLoginStep = $firstLoginStep;

        return $this;
    }

    public function getInitialDivesCount(): ?int
    {
        return $this->initialDivesCount;
    }

    public function setInitialDivesCount(?int $initialDivesCount): static
    {
        $this->initialDivesCount = $initialDivesCount;

        return $this;
    }


    public function getProfilPrivacy(): PrivacyOption
    {
        return $this->profilPrivacy;
    }

    public function setProfilPrivacy(PrivacyOption $profilPrivacy): self
    {
        $this->profilPrivacy = $profilPrivacy;
        return $this;
    }

    public function getLogBooksPrivacy(): PrivacyOption
    {
        return $this->logBooksPrivacy;
    }

    public function setLogBooksPrivacy(PrivacyOption $logBooksPrivacy): self
    {
        $this->logBooksPrivacy = $logBooksPrivacy;
        return $this;
    }

    public function getCertificatesPrivacy(): PrivacyOption
    {
        return $this->certificatesPrivacy;
    }

    public function setCertificatesPrivacy(PrivacyOption $certificatesPrivacy): self
    {
        $this->certificatesPrivacy = $certificatesPrivacy;
        return $this;
    }

    public function getGalleryPrivacy(): PrivacyOption
    {
        return $this->galleryPrivacy;
    }

    public function setGalleryPrivacy(PrivacyOption $galleryPrivacy): self
    {
        $this->galleryPrivacy = $galleryPrivacy;
        return $this;
    }

    /**
     * @return Collection<int, Divelog>
     */
    public function getDivelogs(): Collection
    {
        return $this->divelogs;
    }

    public function addDivelog(Divelog $divelog): static
    {
        if (!$this->divelogs->contains($divelog)) {
            $this->divelogs->add($divelog);
            $divelog->setOwner($this);
        }

        return $this;
    }

    public function removeDivelog(Divelog $divelog): static
    {
        if ($this->divelogs->removeElement($divelog)) {
            // set the owning side to null (unless already changed)
            if ($divelog->getOwner() === $this) {
                $divelog->setOwner(null);
            }
        }

        return $this;
    }

}
