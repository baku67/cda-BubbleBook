<?php
namespace App\DTO\Request;

use App\Enum\DiveOxygenMode;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class AddDiveInfosDTO
{
    /**
     * @Assert\NotBlank()
     * @Assert\Length(min=3, max=100)
     */
    private string $title;

    /**
     * @Assert\NotBlank()
     * @Assert\Length(max=500)
     */
    private string $description;

    /**
     * @Assert\NotNull()
     * @Assert\PositiveOrZero()
     */
    private int $duration;

    /**
     * @Assert\NotNull()
     * @Assert\PositiveOrZero()
     */
    private float $maxDepth;

    /**
     * Mode d’oxygène
     *
     * @Assert\NotBlank(message="Le mode d’oxygène est requis.")
     * @Assert\Choice(
     *     choices=DiveOxygenMode::VALUES,
     *     message="Le mode d’oxygène doit être l’un des choix valides."
     * )
     * @Type("string")
     */
    public string $oxygenMode;

    /**
     * Pourcentage de mélange (en %)
     *
     * @Assert\Type(
     *     type="integer",
     *     message="Le pourcentage de mélange doit être un entier."
     * )
     * @Assert\Range(
     *     min=21,
     *     max=100,
     *     minMessage="Le pourcentage doit être au moins {{ limit }} %.",
     *     maxMessage="Le pourcentage ne peut pas dépasser {{ limit }} %."
     * )
     * @Type("integer")
     */
    public ?int $oxygenMix = null;

    /**
     * Indique si le palier de sécurité a été effectué
     *
     * @Assert\NotNull(message="Le choix d'état de palier de sécurité doit être renseigné")
     * @Assert\Type(type="bool", message="La valeur doit être booléenne.")
     * @Type("boolean")
     */
    private bool $safetyStop;

    /**
     * @Assert\NotNull()
     * @Assert\PositiveOrZero()
     */
    private int $weight;

    /**
     * Température de l’eau (°C), facultative
     *
     * @Assert\Type(
     *     type="numeric",
     *     message="La température doit être un nombre."
     * )
     * @Assert\Range(
     *     min=-2,
     *     max=40,
     *     notInRangeMessage="La température doit être comprise entre {{ min }} °C et {{ max }} °C."
     * )
     * @Type("float")
     */
    private ?float $temperature = null;


    /**
     * Choix de visibilité de la plongée
     *
     * @Assert\Choice(
     *     choices=DiveVisibility::VALUES,
     *     message="La visibilité doit être l’un des choix valides."
     * )
     * @Type("string")
     */
    public ?string $visibility;


    public function getTitle(): string    { return $this->title; }
    public function setTitle(string $t)   { $this->title = $t; return $this; }

    public function getDescription(): string    { return $this->description; }
    public function setDescription(string $d)    { $this->description = $d; return $this; }

    public function getDuration(): int    { return $this->duration; }
    public function setDuration(int $m)    { $this->duration = $m; return $this; }

    public function getMaxDepth(): float    { return $this->maxDepth; }
    public function setMaxDepth(float $m)    { $this->maxDepth = $m; return $this; }

    public function getOxygenMode(): string    { return $this->oxygenMode; }
    public function setOxygenMode(string $oxygenMode): self    { $this->oxygenMode = $oxygenMode; return $this; }

    // facultatif:
    public function getOxygenMix(): ?float     { return $this->oxygenMix; }
    public function setOxygenMix(?float $oxygenMix): self    { $this->oxygenMix = $oxygenMix; return $this; }

    public function isSafetyStop(): bool    { return $this->safetyStop; }
    public function setSafetyStop(bool $safetyStop): self     { $this->safetyStop = $safetyStop; return $this; }

    public function getWeight(): float    { return $this->weight; }
    public function setWeight(float $m)    { $this->weight = $m; return $this; }

    // facultatif:
    public function getTemperature(): ?float    { return $this->temperature; }
    public function setTemperature(?float $temperature): self     { $this->temperature = $temperature; return $this; }

    // facultatif:
    public function getVisibility(): ?string    { return $this->visibility; }
    public function setVisibility(?string $visibility): self    { $this->visibility = $visibility; return $this; }

    /**
     * Validation conditionnelle :
     * si le mode est MIX ou NITROX, alors oxygenMix ne doit pas être null.
     *
     * @Assert\Callback
     */
    public function validateOxygenMix(ExecutionContextInterface $context): void
    {
        // on autorise et on requiert oxygenMix si mode MIX ou NITROX
        $needsMix = in_array(
            $this->oxygenMode,
            [
                DiveOxygenMode::MIX->value,
                DiveOxygenMode::NITROX->value
            ],
            true
        );

        if ($needsMix && $this->oxygenMix === null) {
            $context
                ->buildViolation('Le pourcentage de mélange est requis en mode {{ mode }}.')
                ->setParameter('{{ mode }}', $this->oxygenMode)
                ->atPath('oxygenMix')
                ->addViolation();
        }

        // on interdit oxygenMix pour les autres modes (p. ex. AIR)
        if (! $needsMix && $this->oxygenMix !== null) {
            $context
                ->buildViolation('Le pourcentage de mélange ne doit être renseigné qu’en mode MIX ou NITROX.')
                ->atPath('oxygenMix')
                ->addViolation();
        }
    }

}
