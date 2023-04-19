<?php
include("businesslogic/simpleLogic.php");

header("Content-Type: application/json");

$logic = new SimpleLogic();
$method = $_GET["method"];
$result = $logic->handleRequest($method);
echo json_encode($result);
