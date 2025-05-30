<?php 

namespace App\Service\User;

use App\DTO\Request\UserSearchCriteriaDTO;
use App\DTO\Response\UsersSearchDTO;
use App\Entity\User\User;
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
    public function search(User $viewer, UserSearchCriteriaDTO $searchDTO): array
    {
        $users = $this->userRepository->searchUsers(
            $viewer,
            $searchDTO->query,
            $searchDTO->type,
            $searchDTO->order,
            $searchDTO->page,
            $searchDTO->pageSize
        );
    
        // Convertir les entités User en UserSearchDTO
        return UsersSearchDTO::fromEntities($users);
    }
}
