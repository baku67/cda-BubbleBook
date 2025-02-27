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

    #[Assert\Choice(choices: ['username'], message: 'Le champ de tri est invalide.')]
    public ?string $sortBy = 'username';

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
        
        $instance->query = $request->query->get('query', '') ?: null;
        $instance->sortBy = $request->query->get('sortBy', 'username');
        $instance->order = $request->query->get('order', 'asc');

        // Vérification et conversion sécurisée des valeurs numériques
        $instance->page = filter_var($request->query->get('page', 1), FILTER_VALIDATE_INT) ?: 1;
        $instance->pageSize = filter_var($request->query->get('pageSize', 10), FILTER_VALIDATE_INT) ?: 10;

        // Sécurisation des valeurs `sortBy` et `order`
        $allowedSortFields = ['username'];
        $allowedOrders = ['asc', 'desc'];

        $instance->sortBy = in_array($instance->sortBy, $allowedSortFields) ? $instance->sortBy : 'username';
        $instance->order = in_array($instance->order, $allowedOrders) ? $instance->order : 'asc';

        return $instance;
    }
}
