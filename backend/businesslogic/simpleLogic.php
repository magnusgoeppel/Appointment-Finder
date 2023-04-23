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
            case "queryAppointmentDetails":
                $res = $this->dh->queryAppointmentDetails($param);
                break;
            case "submitUserVote":
                $res = $this->submitUserVote($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }

    function submitUserVote($params)
    {
        $appointmentId = $params['appointment_id'];
        $username = $params['username'];
        $selectedDates = $params['selected_dates'];
        $comment = $params['comment'];

        $userVoteId = $this->dh->submitUserVote($appointmentId, $username, $selectedDates, $comment);

        if ($userVoteId !== false) {
            $res = $this->dh->submitSelectedDates($userVoteId, $selectedDates);
        } else {
            $res = false;
        }

        return $res;
    }
}
