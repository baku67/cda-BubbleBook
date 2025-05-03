<?php
namespace App\Controller\Dive;

use App\DTO\Response\DiveDTO;
use App\Entity\Divelog\Divelog;
use App\Repository\Dive\DiveRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DiveController extends AbstractController
{
    public function __construct(private DiveRepository $diveRepository) {}

    /**
     * Liste les plongées d'un carnet (par ID) pour l'utilisateur authentifié
     *
     * GET /api/me/divelogs/{id}/dives
     */
    #[Route('/api/me/divelogs/{divelog}/dives', name: 'api_me_divelog_dives', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function list(Divelog $divelog): JsonResponse
    {
        $user = $this->getUser();
        // Vérifie que le carnet appartient à l'utilisateur
        if (!$user || $divelog->getOwner()->getId() !== $user->getId()) {
            return $this->json(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        // Récupère les plongées via le repository pour plus de flexibilité (pagination, filtres...)
        $dives = $this->diveRepository->findBy(['divelog' => $divelog], ['diveDatetime' => 'ASC']);

        // Transforme en DTO
        $data = array_map(
            fn (\App\Entity\Dive\Dive $dive) => DiveDTO::fromEntity($dive)->toArray(),
            $dives
        );

        return $this->json($data, Response::HTTP_OK);
    }
}
