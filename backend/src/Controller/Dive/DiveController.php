<?php
namespace App\Controller\Dive;

use App\DTO\Request\AddDiveDTO;
use App\DTO\Response\DiveDTO;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use App\Repository\Dive\DiveRepository;
use App\Service\Dive\DiveService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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


    /**
     * Ajoute une plongée à un divelog appartenant à l'utilisateur authentifié
     *
     * POST /api/me/divelogs/{id}/dives
     */
    #[Route('/api/me/divelogs/{divelog}/dives', name: 'api_me_divelog_add_dive', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function addDiveToUserDivelog(
        Request $request,
        ValidatorInterface $validator,
        SerializerInterface $serializer,
        Divelog $divelog,
        DiveService $diveService,
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $dto = $serializer->deserialize($request->getContent(), AddDiveDTO::class, 'json');
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            $dive = $diveService->addDiveToDivelog($divelog, $dto, $user);
        } catch (\DomainException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_FORBIDDEN);
        }

        return $this->json(DiveDTO::fromEntity($dive)->toArray(), Response::HTTP_CREATED);
    }
}
