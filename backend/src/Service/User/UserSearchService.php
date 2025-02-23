<?php 

namespace App\Service;

use App\DTO\Request\UserSearchCriteriaDTO;
use App\Repository\UserRepository;

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
     * @param UserSearchCriteriaDTO $search
     * @return array
     */
    public function search(UserSearchCriteriaDTO $search): array
    {
        // Construire la requête de recherche en fonction des critères
        $queryBuilder = $this->userRepository->createQueryBuilder('u');

        if ($search->query) {
            $queryBuilder
                ->andWhere('u.username LIKE :query OR u.email LIKE :query')
                ->setParameter('query', '%' . $search->query . '%');
        }

        if ($search->sortBy && in_array($search->sortBy, ['username', 'email'])) {
            $queryBuilder->orderBy('u.' . $search->sortBy, $search->order ?? 'asc');
        }

        // Pagination
        $queryBuilder
            ->setFirstResult(($search->page - 1) * $search->pageSize)
            ->setMaxResults($search->pageSize);

        return $queryBuilder->getQuery()->getResult();
    }
}
