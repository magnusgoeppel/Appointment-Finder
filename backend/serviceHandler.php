<?php
include("businesslogic/simpleLogic.php");

$param = "";

$method = "";


isset($_GET["method"]) ? $method = $_GET["method"] : false;
isset($_GET["param"]) ? $param = $_GET["param"] : false;
isset($_GET["param2"]) ? $param2 = $_GET["param2"] : false;
isset($_GET["param3"]) ? $param3 = $_GET["param3"] : false;
isset($_GET["param4"]) ? $param4 = $_GET["param4"] : false;


$logic = new SimpleLogic();
$result = $logic->handleRequest($method, $param);

if ($result == null)
{
    response("GET", 400, null);
}
else
{
    response("GET", 200, $result);
}

function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');

    switch ($method)
    {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
            break;
    }
}



