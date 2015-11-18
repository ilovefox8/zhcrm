<?php
namespace Fox\Controllers;

use \Fox\Core\Exceptions\NotFound;
use \Fox\Core\Exceptions\Error;
use \Fox\Core\Exceptions\Forbidden;
use \Fox\Core\Exceptions\BadRequest;
use \GuzzleHttp;

class Cc extends \Fox\Core\Controllers\Base
{
    /*protected function checkControllerAccess()
    {
        if (!$this->getUser()->isAdmin()) {
            throw new Forbidden();
        }
    }*/

    public function actionMakeCall($params, $data, $request)
    {
        $client = new GuzzleHttp\Client();
        /*$res = $client->request('GET', 'http://218.244.133.9:81/agc/api.php?function=version', [
            'auth' => ['ilovefox8', 'a199000000']
        ]);*/

        $res = $client->request('GET', 'http://218.244.133.9:81/agc/api.php?function=version');

        return $res->getBody();
    }

}