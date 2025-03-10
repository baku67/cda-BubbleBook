<?php
namespace App\Controller\Certificate;

use App\Service\Certificate\UserCertificateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\DTO\Request\AddUserCertificateDTO;
use App\Entity\User\User;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;


class UserCertificateController extends AbstractController
{
    public function __construct(private UserCertificateService $userCertificateService) {}

    #[Route('/api/user/certificates', name: 'api_get_user_certificates', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserCertificates(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $certificatesDTOs = $this->userCertificateService->getUserCertificates($user);
        return $this->json($certificatesDTOs);
    }

    #[Route('/api/user/certificates', name: 'api_user_add_certificate', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function addUserCertificate(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $dto = new AddUserCertificateDTO();
        $dto->organisationValue = $data['organisationValue'] ?? null;
        $dto->certificateValue = $data['certificateValue'] ?? null;
        $dto->obtainedDate = isset($data['obtainedDate']) ? new \DateTime($data['obtainedDate']) : null;
        $dto->location = $data['location'] ?? null;

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return new JsonResponse(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            $userCertificate = $this->userCertificateService->addUserCertificateWithOrder($user, $dto);
            return new JsonResponse([
                'id' => $userCertificate->getId(),
                'certificate' => [
                    'id' => $userCertificate->getCertificate()->getId(),
                    'name' => $userCertificate->getCertificate()->getName(),
                    'type' => $userCertificate->getCertificate()->getType(),
                ],
                'displayOrder' => $userCertificate->getDisplayOrder(),
                'obtainedDate' => $userCertificate->getObtainedDate()?->format('Y-m-d'),
                'location' => $userCertificate->getLocation(),
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\LogicException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }
    }

    #[Route('/api/user/certificates/order', name: 'api_user_update_certificate_order', methods: ['PUT'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function updateUserCertificatesOrder(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['certificates']) || !is_array($data['certificates'])) {
            return new JsonResponse(['error' => 'Invalid data format'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->userCertificateService->updateCertificateOrder($user, $data['certificates']);
            return new JsonResponse(['message' => 'Order updated successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }


    #[Route('/api/user/certificates/{certificateId}', name: 'api_user_delete_certificate', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function deleteUserCertificate(int $certificateId): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $this->userCertificateService->deleteUserCertificate($user, $certificateId);
            return new JsonResponse(['message' => 'Certificate deleted successfully.'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }
}
