<?php
namespace App\Controller\Auth;

use App\DTO\Request\RegisterDTO;
use App\Entity\User\User;
use App\Repository\User\RoleRepository;
use App\Repository\User\UserRepository;
use App\Service\Auth\EmailCheckExistService;
use App\Service\Auth\RegistrationService;
use App\Service\Auth\ResendConfirmationMailService;
use App\Service\Auth\MailConfirmationTokenService;
use App\Service\Auth\UsernameService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\Auth\MailerService;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterController extends AbstractController
{
    public function __construct(
        private MailerService $mailService,
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private UsernameService $usernameService,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
        private RoleRepository $roleRepository,
    ) {}


    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        NormalizerInterface $normalizer,
        ValidatorInterface $validator,
        RegistrationService $registrationService
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Hydrater le DTO
        $registerDTO = new RegisterDTO(
            $data['email'] ?? '',
            $data['password'] ?? '',
            $data['passwordCheck'] ?? '',
            $data['acceptTerms'] ?? false
        );

        // Valider le DTO
        $errors = $validator->validate($registerDTO);
        if (count($errors) > 0) {
            return new Response((string) $errors, Response::HTTP_BAD_REQUEST);
        }
    
        // Appeler le service d'enregistrement
        $user = $registrationService->registerUser($registerDTO);

        // Normaliser l'utilisateur sans les données sensibles
        $userData = $normalizer->normalize($user, null, [
            ObjectNormalizer::ATTRIBUTES => ['id', 'email', 'username', 'avatarUrl', 'bannerUrl', 'roles']
        ]);

        return new JsonResponse([
            'message' => 'User registered successfully',
            'user' => $userData
        ], JsonResponse::HTTP_CREATED);
    }


    #[Route('/api/check-email-exist', name: 'check_email_exist', methods: ['POST'])]
    public function checkEmailExist(Request $request, EmailCheckExistService $emailCheckExistService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        if (!$email) {
            return new JsonResponse(['error' => 'Email is required.'], Response::HTTP_BAD_REQUEST);
        }
    
        $exists = $emailCheckExistService->isEmailExists($email);
    
        return new JsonResponse(['exists' => $exists], Response::HTTP_OK);
    }


    // Click sur le lien de Confirmation de mail:
    #[Route('/api/confirm-email', name: 'api_confirm_email', methods: ['GET'])]
    public function confirmEmail(Request $request, MailConfirmationTokenService $emailConfirmationTokenService): JsonResponse
    {
        $token = $request->query->get('token');
    
        try {
            $emailConfirmationTokenService->confirmEmail($token);
            return new JsonResponse(['status' => 'Email successfully verified'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    

    // Renvoi d'un lien de confirmation de mail (TODO logged in ?):
    #[Route('/api/resend-confirmation', name: 'resend_confirmation', methods: ['POST'])]
    public function resendConfirmationEmail(Request $request, ResendConfirmationMailService $resendConfirmationMailService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        $user = $this->getUser();
        if (!$user instanceof User || $user->getEmail() !== $email) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }
    
        try {
            $resendConfirmationMailService->resend($user);
            return new JsonResponse(['status' => 'Confirmation email sent'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
