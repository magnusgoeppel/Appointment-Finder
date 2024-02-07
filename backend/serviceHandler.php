<?php
include("businesslogic/simpleLogic.php");

$param = "";
$method = "";

isset($_REQUEST["method"]) ? $method = $_REQUEST["method"] : false;
isset($_REQUEST["param"]) ? $param = $_REQUEST["param"] : false;

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
