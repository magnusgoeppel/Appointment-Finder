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
        foreach ($result as $row)
        {
            $appointment = new Appointment($row['id'], $row['title'], $row['location'], $row['date'], $row['expiry_date']);
            $appointments[] = $appointment;
        }
        return $appointments;
    }

    public function queryAppointmentDetails($appointment_id)
    {
        return $this->getAppointmentDetails($appointment_id);
    }

    public function getAppointmentDetails($appointment_id)
    {
        $selectable_dates = $this->getSelectableDates($appointment_id);
        $user_votes = $this->getUserVotes($appointment_id);

        return [
            'selectable_dates' => $selectable_dates,
            'user_votes' => $user_votes,
        ];
    }

    private function getSelectableDates($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT id, date, (SELECT COUNT(*) FROM user_votes 
                                   WHERE fk_selected_date_id = selectable_dates.id) as votes FROM selectable_dates WHERE fk_appointment_id = '$appointment_id'");

        if (!$result)
        {
            return false;
        }
        return $result;
    }

    private function getUserVotes($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT uv.username, uv.comment, sd.date as selected_date FROM user_votes uv 
                                   JOIN selectable_dates sd ON uv.fk_selected_date_id = sd.id WHERE uv.fk_appointment_id = '$appointment_id'");

        if (!$result)
        {
            return false;
        }
        return $result;
    }

    public function submitVote($appointmentId, $username, $selectedDaten, $comment)
    {
        $db = new DB();
        $appointmentId = $db->escape($appointmentId);
        $username = $db->escape($username);
        $selectedDaten = $db->escape($selectedDaten);
        $comment = $db->escape($comment);

        // Get the selected date ID from the selectable_dates table
        $query = "SELECT id FROM selectable_dates WHERE date = '$selectedDaten' AND fk_appointment_id = '$appointmentId'";
        $result = $db->query($query);
        if ($result && count($result) > 0) {
            $selectedDateId = $result[0]['id'];

            // Insert the user vote into the user_votes table
            $query = "INSERT INTO user_votes (fk_appointment_id, username, fk_selected_date_id, comment)
                  VALUES ('$appointmentId', '$username', '$selectedDateId', '$comment')";
            $result = $db->query($query);

            return $result;
        } else {
            return false;
        }
    }
}
