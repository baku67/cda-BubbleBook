<?php 

namespace App\Service\User;

use App\DTO\Request\UserSearchCriteriaDTO;
use App\DTO\Response\UserSearchDTO;
use App\Repository\User\UserRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

class UserSearchService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Recherche des utilisateurs en fonction des critères fournis.
     *
     * @param UserSearchCriteriaDTO $searchDTO
     * @return array
     */
    public function search(UserSearchCriteriaDTO $searchDTO): array
    {        
        // Construire la requête de recherche (TODO: a deplacer dans le repo)
        $queryBuilder = $this->userRepository->createQueryBuilder('u');

        // Filtrage par mot-clé (username) PAS BUGGE ?
        if (!empty($searchDTO->query)) {
            $queryBuilder
                ->andWhere('LOWER(u.username) LIKE LOWER(:query)')
                ->setParameter('query', '%' . strtolower($searchDTO->query) . '%');
        }

        // Sécurisation du tri (usernamed BUGED)
        $allowedSortFields = ['username' => 'u.username', 'email' => 'u.email'];
        if (isset($allowedSortFields[$searchDTO->sortBy])) {
            $queryBuilder->orderBy($allowedSortFields[$searchDTO->sortBy], $searchDTO->order === 'desc' ? 'DESC' : 'ASC');
        }

        // Pagination sécurisée
        $page = max(1, $searchDTO->page ?? 1);
        $pageSize = min(100, max(1, $searchDTO->pageSize ?? 10));

        $queryBuilder
            ->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);

        // Exécuter la requête avec un Paginator
        $paginator = new Paginator($queryBuilder->getQuery());

        // Transformer les entités User en UserSearchResultDTO
        return UserSearchDTO::fromEntities(iterator_to_array($paginator));
    }
}
