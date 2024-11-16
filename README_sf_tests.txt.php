<!-- 3 types de tests phpUnit:


Test unitaires: sur les fonctions des services, pas d'appels réseaux, pas de communications ou de couplages ou d'injections avec d'autres couches (?)
Test fonctionnels: Là oui on peut passer par des controller, des appels réseau (?) 
 -->



<!-- *********************** EXEMPLE TEST FONCTIONNEL (pas unitaire) ******************************************* -->
<!-- ****************************************************************************** -->
<?php
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testHelloFunction()
    {
        $client = static::createClient();
        $client->request('GET', '/hello/Basile');

        // Vérification code 200 response
        $this->assertResponseIsSuccessful();
    
        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);
        $this->assertEquals('Hello, Basile !', $data['message']);
    }
}

// RUN TEST docker:
// docker exec -it *****php_container******** bash
// php bin/phpunit backend/path/to/DefaultControllerTest.php
?>



<!-- Route Controller -->
<?php
use App\Service\Greetings;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/hello/{prenom}', name: 'app_hello', methods: ['GET'])]
    // type-hint $prenom
    public function hello(string $prenom): JsonResponse 
    {
        // return new Response("Hello, $prenom !");
        return $this->json(['message' => "Hello, $prenom !"]);
    }
}

