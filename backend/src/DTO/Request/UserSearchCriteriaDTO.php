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

    #[Assert\Choice(choices: ['divers', 'clubs', null], message: 'Le champ de tri est invalide.')]
    public ?string $type = null;

    #[Assert\Choice(choices: ['asc', 'desc'], message: 'L\'ordre de tri est invalide.')]
    public ?string $order = 'asc';

    #[Assert\Positive(message: 'Le numéro de page doit être un entier positif.')]
    public ?int $page = 1;

    #[Assert\Positive(message: 'La taille de la page doit être un entier positif.')]
    #[Assert\LessThanOrEqual(value: 100, message: 'La taille de la page ne peut pas dépasser {{ compared_value }}.')]
    public ?int $pageSize = 10;

    public static function fromRequest(Request $request): self
    {
        $dto = new self();
        $dto->query = $request->query->get('search', null);
        if ($dto->query === null) {
            throw new \InvalidArgumentException("Le paramètre 'search' est obligatoire.");
        }
        
        // Conversion automatique de "divers" → "option-diver" et "clubs" → "option-club"
        $typeMapping = [
            'divers' => 'option-diver',
            'clubs' => 'option-club',
            'all' => null
        ];
        // Récupérer le type, mais ignorer les valeurs non valides
        $requestedType = $request->query->get('type', null);
        $dto->type = isset($typeMapping[$requestedType]) ? $typeMapping[$requestedType] : null;

        // Assurer que "order" est bien récupéré et valide
        $allowedOrders = ['asc', 'desc'];
        $dto->order = $request->query->get('order', 'asc');
        if (!in_array($dto->order, $allowedOrders, true)) {
            $dto->order = 'asc'; // Sécurité : on force un ordre valide
        }

        // Pagination sécurisée
        $dto->page = max(1, (int) $request->query->get('page', 1));
        $dto->pageSize = min(100, max(1, (int) $request->query->get('pageSize', 10)));
        
        return $dto;
    }
}
