<?php
include( __DIR__ . '/../models/appointment.php');
include(__DIR__ . '/db.php');

class DataHandler
{

    // Hilfsfunktionen für die Datenbankabfragen
    public function queryAppointments()
    {
        return $this->getAppointmentData();
    }

    public function queryAppointmentDetails($appointment_id)
    {
        return $this->getAppointmentDetails($appointment_id);
    }

    public function submitUserVote($param)
    {
        return $this->getSubmitUserVote($param);
    }

    public function createNewAppointment($data)
    {
        return $this->getCreateNewAppointment($data);
    }

    public function deleteAppointment($data)
    {
        return $this->getDeleteAppointment($data);
    }

    // Gibt alle Appointments zurück
    private function getAppointmentData()
    {
        $db = new DB();
        $result = $db->query("SELECT * FROM appointments");

        if (!$result)
        {
            $db->close();
            return false;
        }
        $appointments = [];


        foreach ($result as $row)
        {
            $expiryDate = new DateTime($row['expiry_date']);
            $formattedExpiryDate = $expiryDate->format('d.m.Y');

            $appointment = new Appointment($row['id'], $row['title'], $row['location'], $formattedExpiryDate);
            $appointments[] = $appointment;
        }
        $db->close();
        return $appointments;
    }

    // Gibt alle Details zu einem Appointment zurück
    private function getAppointmentDetails($appointment_id)
    {
        $selectable_dates = $this->getSelectableDates($appointment_id);
        $user_votes = $this->getUserVotes($appointment_id);
        $description = $this->getDescription($appointment_id);
        $duration = $this->getDuration($appointment_id);

        return ['selectable_dates' => $selectable_dates, 'user_votes' => $user_votes, 'appointment_id' => $appointment_id, 'description' => $description, 'duration' => $duration];
    }

    // Gibt die Terminoptionen zurück
    private function getSelectableDates($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT selectable_dates.id, selectable_dates.date, selectable_dates.time, COUNT(user_selected_dates.id) as votes
                                  FROM selectable_dates
                                  LEFT JOIN user_selected_dates ON selectable_dates.id = user_selected_dates.fk_selectable_dates_id
                                  WHERE selectable_dates.fk_appointment_id = '$appointment_id'
                                  GROUP BY selectable_dates.id, selectable_dates.date, selectable_dates.time");

        if (!$result)
        {
            return false;
        }
        foreach ($result as &$row)
        {
            $datetime = new DateTime($row['date'] . ' ' . $row['time']);
            $row['date'] = $datetime->format('d.m.Y');
            $row['time'] = $datetime->format('H:i');
        }
        $db->close();
        return $result;
    }

    // Gibt die User Votes zurück
    private function getUserVotes($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT uv.id as id, uv.username as username, uv.comment as comment, sd.date as selected_date, sd.time as selected_time
                                  FROM user_votes uv
                                  JOIN user_selected_dates usd ON uv.id = usd.fk_user_vote_id
                                  JOIN selectable_dates sd ON usd.fk_selectable_dates_id = sd.id
                                  WHERE uv.fk_appointment_id = '$appointment_id'");


        if (!$result)
        {
            $db->close();
            return false;
        }
        foreach ($result as &$row)
        {
            $datetime = new DateTime($row['selected_date'] . ' ' . $row['selected_time']);
            $row['selected_date'] = $datetime->format('d.m.Y');
            $row['selected_time'] = $datetime->format('H:i');
        }
        $db->close();
        return $result;
    }

    // Gibt die Beschreibung zurück
    private function getDescription($appointment_id)
    {

        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT description FROM appointments WHERE id = '$appointment_id'");

        if (!$result)
        {
            $db->close();
            return false;
        }
        $db->close();
        return $result[0]['description'];
    }

    // Gibt die Dauer zurück
    private function getDuration($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT duration FROM appointments WHERE id = '$appointment_id'");

        if (!$result)
        {
            $db->close();
            return false;
        }
        $db->close();
        return $result[0]['duration'];
    }

    // Speichert ein neues Appointment in der Datenbank
    private function getSubmitUserVote($param)
    {
        $appointment_id = $param['appointment_id'];
        $username = $param['username'];
        $comment = $param['comment'];
        $selected_dates = $param['selected_dates'];

        $db = new DB();


        $appointment_id = $db->escape($appointment_id);
        $username = $db->escape($username);
        $comment = $db->escape($comment);
        $sql = "INSERT INTO user_votes (fk_appointment_id, username, comment) VALUES ('$appointment_id', '$username', '$comment')";
        $db->query($sql);


        $user_vote_id = $db->getLastInsertedId();

        // Für jede ausgewählte Option wird ein Eintrag in der Tabelle user_selected_dates erstellt
        foreach ($selected_dates as $selected_date)
        {
            $date = $selected_date['date'];
            $time = $selected_date['time'];


            $sql = "SELECT id FROM selectable_dates WHERE fk_appointment_id = '$appointment_id' AND date = '$date' AND time = '$time'";
            $result = $db->query($sql);

            // Erstelle einen Eintrag in der Tabelle user_selected_dates
            if ($result)
            {
                $selectable_dates_id = $result[0]['id'];
                $sql = "INSERT INTO user_selected_dates (fk_user_vote_id, fk_selectable_dates_id) VALUES ('$user_vote_id', '$selectable_dates_id')";
                $db->query($sql);
            }
        }
        $db->close();
        return ['success' => true];
    }

    // Speichert ein neues Appointment in der Datenbank
    private function getCreateNewAppointment($data)
    {
        $title = $data["title"];
        $location = $data["location"];
        $description = $data["description"];
        $duration = $data["duration"];
        $selectable_dates = $data["selectable_dates"];
        $expiry_date = $data["expiry_date"];

        $db = new DB();

        $title = $db->escape($title);
        $location = $db->escape($location);
        $description = $db->escape($description);
        $duration = $db->escape($duration);
        $selectable_dates = $db->escape($selectable_dates);
        $expiry_date = $db->escape($expiry_date);

        $sql = "INSERT INTO appointments (title, location, description, duration, expiry_date) VALUES ('$title', '$location', '$description', '$duration', '$expiry_date')";
        $db->query($sql);

        $appointment_id = $db->getLastInsertedId();

        $selectable_dates = str_replace(" Uhr", "", $selectable_dates);

        $selectable_dates = str_replace(["\n", "\r\n", "\r", "\\n"], ",", $selectable_dates);

        // Teile den String in ein Array
        $selectable_dates_array = explode(",", $selectable_dates);

        // Solange $selectable_dates_array Elemente enthält
        for ($i = 0; $i < count($selectable_dates_array); $i += 2)
        {
            $date = $selectable_dates_array[$i];
            $time = $selectable_dates_array[$i + 1];

            // Entferne Leerzeichen und ersetze Punkte durch Doppelpunkte in der Uhrzeit
            $time = str_replace(" ", "", $time);
            $time = str_replace(".", ":", $time);

            $sql = "INSERT INTO selectable_dates (fk_appointment_id, date, time) VALUES ('$appointment_id', '$date', '$time')";
            $db->query($sql);
        }
        $db->close();
        return ['success' => true];
    }

    // Löscht ein Appointment aus der Datenbank
    private function getDeleteAppointment($data)
    {
        $appointment_id = $data["appointmentId"];

        $db = new DB();

        $appointment_id = $db->escape($appointment_id);

        $sql = "DELETE FROM appointments WHERE id = '$appointment_id' ";
        $db->query($sql);

        $sql = "DELETE FROM selectable_dates WHERE fk_appointment_id = '$appointment_id'";
        $db->query($sql);

        $sql = "DELETE FROM user_votes WHERE fk_appointment_id = '$appointment_id'";
        $db->query($sql);

        $db->close();
        return ['success' => true];
    }
}
