<?php
include("./models/appointment.php");

class DataHandler
{
    // Fügen Sie hier Ihren Datenbankverbindungscode ein, z. B.
    // private $conn;

    public function __construct()
    {
        // Verbinden Sie sich hier mit Ihrer Datenbank, z. B.
        // $this->conn = new mysqli("localhost", "bif2webscriptinguser", "bif2021", "appointment_finder");
    }

    public function queryAppointments()
    {
        // Fügen Sie hier Ihren Datenbankabfragecode ein, z. B.
        // $result = $this->conn->query("SELECT * FROM appointments");
        // return $result->fetch_all(MYSQLI_ASSOC);

        // Verwenden Sie vorerst Demo-Daten:
        return [ new Appointment(1, "Meeting", "Conference Room", "2023-04-20", "2023-04-19"),
                new Appointment(2, "Workshop", "Training Room", "2023-04-25", "2023-04-23"),
                new Appointment(3, "Team Lunch", "Cafeteria", "2023-04-26", "2023-04-24"),
        ];
    }
}