<?php

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExampleTest extends WebTestCase
{
    public function testExampleTest() 
    {
        $client = static::createClient();
        $response = $client->request('GET', '/api');

        // $this->assert
    
    }
}