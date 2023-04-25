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
        switch ($method)
        {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;

            case "queryAppointmentDetails":
                $res = $this->dh->queryAppointmentDetails($param);
                break;

            case "submitUserVote":
                $res = $this->dh->submitUserVote($param);
                break;

            case "createNewAppointment":
                $res = $this->dh->createNewAppointment($param);
                break;

            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);
                break;

            default:
                $res = null;
                break;
        }
        return $res;
    }
}
