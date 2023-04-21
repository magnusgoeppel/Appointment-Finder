<?php
include( __DIR__ . '/../models/appointment.php');
include(__DIR__ . '/db.php');
class DataHandler
{
    public function queryAppointments()
    {
        return /*$this -> getDemoData() && */$this -> getAppointmentData();
    }

    private function getAppointmentData()
    {
        $db = new DB();
        $result = $db->query("SELECT * FROM appointments");
        $db->close();

        if (!$result) {
            return false;
        }

        $appointments = [];
        foreach ($result as $row) {
            $appointment = new Appointment($row['id'], $row['title'], $row['location'], $row['date'], $row['expiry_date']);
            $appointments[] = $appointment;
        }

        return $appointments;
    }


    private function getDemoData()
    {
        $demodata =
        [
            [new Appointment(1, "Meeting", "Conference Room", "2023-04-20", "2023-04-19")],
            [new Appointment(2, "Workshop", "Training Room", "2023-04-25", "2023-04-23")],
            [new Appointment(3, "Team Lunch", "Cafeteria", "2023-04-26", "2023-04-24")],
        ];
        return $demodata;
    }
}
