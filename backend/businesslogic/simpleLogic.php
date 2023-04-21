<?php
include(__DIR__ . '/../db/dataHandler.php');

class SimpleLogic
{
    private $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param = null)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            // 2-----------------------------------------------------------------------------
            case "queryAppointmentDetails":
                $res = $this->dh->queryAppointmentDetails($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}