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
            case "submitVote": // Fügen Sie diesen neuen Case hinzu
                $res = $this->submit_Vote($param['appointmentId'], $param['username'], $param['selectedDaten'], $param['comment']);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }

    public function submit_Vote($appointmentId, $username, $selectedDaten, $comment)
    {
        $dataHandler = new DataHandler();
        $result = $dataHandler->submitVote($appointmentId, $username, $selectedDaten, $comment);

        if ($result) {
            return ['success' => true];
        } else {
            return ['success' => false];
        }
    }

}