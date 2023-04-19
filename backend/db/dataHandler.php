<?php
include("../models/appointment.php");
class DataHandler
{
    public function queryAppointments()
    {
        return $this->getDemoData();
    }

    private function getDemoData()
    {
        return [
            new Appointment(1, "Meeting", "Conference Room", "2023-04-20", "2023-04-19"),
            new Appointment(2, "Workshop", "Training Room", "2023-04-25", "2023-04-23"),
            new Appointment(3, "Team Lunch", "Cafeteria", "2023-04-26", "2023-04-24"),
        ];
    }
}
