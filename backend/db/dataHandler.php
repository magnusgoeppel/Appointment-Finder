<?php
include( __DIR__ . '/../models/appointment.php');
include(__DIR__ . '/db.php');
class DataHandler
{
    public function queryAppointments()
    {
        return $this -> getAppointmentData();
    }

    private function getAppointmentData()
    {
        $db = new DB();
        $result = $db->query("SELECT * FROM appointments");

        if (!$result)
        {
            return false;
        }

        $appointments = [];
        foreach ($result as $row) {
            $appointment = new Appointment($row['id'], $row['title'], $row['location'], $row['date'], $row['expiry_date']);
            $appointments[] = $appointment;
        }

        // Rückgabe eines flachen Arrays
        return $appointments;
    }
}
