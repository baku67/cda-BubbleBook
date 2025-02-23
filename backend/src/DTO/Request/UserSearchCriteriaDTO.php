<?php
namespace App\DTO\Request;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;

class UserSearchCriteriaDTO
{
    #[Assert\NotBlank(message: 'Le terme de recherche ne peut pas être vide.')]
    #[Assert\Length(
        min: 3,
        minMessage: 'Le terme de recherche doit comporter au moins {{ limit }} caractères.'
    )]
    public ?string $query = null;

    // Le champ sur lequel on recherche en BDD (pour 'instant c'est que des OtherUsers, mais ça pourra être d'autre types d'objets plus tard (lieux, clubs, etc...))
    #[Assert\Choice(choices: ['username'], message: 'Le champ de tri est invalide.')]
    public ?string $sortBy = 'name';

    #[Assert\Choice(choices: ['asc', 'desc'], message: 'L\'ordre de tri est invalide.')]
    public ?string $order = 'asc';

    #[Assert\Positive(message: 'Le numéro de page doit être un entier positif.')]
    public ?int $page = 1;

    #[Assert\Positive(message: 'La taille de la page doit être un entier positif.')]
    #[Assert\LessThanOrEqual(value: 100, message: 'La taille de la page ne peut pas dépasser {{ compared_value }}.')]
    public ?int $pageSize = 10;

    public static function fromRequest(Request $request): self
    {
        $instance = new self();
        $instance->query = $request->query->get('query', '');
        $instance->sortBy = $request->query->get('sortBy', 'username');
        $instance->order = $request->query->get('order', 'asc');
        $instance->page = (int) $request->query->get('page', 1);
        $instance->pageSize = (int) $request->query->get('pageSize', 10);

        return $instance;
    }
}
