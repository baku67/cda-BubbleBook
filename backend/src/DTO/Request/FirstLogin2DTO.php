<?php
namespace App\DTO\Request;

use App\Enum\Avatar;
use App\Enum\Banner;
use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class FirstLogin2DTO
{
    // Valeurs possibles pour Avatar et Banner (TODELETE si upload ou photo)
    private const AVATAR_VALUES = Avatar::VALUES;
    private const BANNER_VALUES = Banner::VALUES;

    #[Assert\NotBlank(message: 'Le nom d\'utilisateur est requis.')]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Le nom d\'utilisateur ne peut pas dépasser {{ limit }} caractères.'
    )]
    public string $username;

    #[Assert\Length(
        max: 3,
        maxMessage: 'Le code Pays "ISO 3166-1 alpha-3" requiert {{ limit }} caractères.'
    )]
    public ?string $nationality;

    // TODO: à rendre plus flexible si select from file ou photo
    #[Assert\Choice(
        choices: self::AVATAR_VALUES,
        message: "The selected avatar is not valid."
    )]
    public ?string $avatar = "";

    #[Assert\Choice(
        choices: self::BANNER_VALUES,
        message: "The selected banner is not valid."
    )]
    public ?string $banner = "";

    // Nombre de plongés initiales nullable 
    #[Assert\Type(type: "integer", message: "The number of initial dives must be a number or null.")]
    #[Assert\PositiveOrZero()]
    #[Assert\LessThanOrEqual(5000)]
    public ?int $initialDivesCount = null;
}