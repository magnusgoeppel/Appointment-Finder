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
                // Format the date and expiry_date
                $date = new DateTime($row['date']);
                $formattedDate = $date->format('d.m.Y');
                $expiryDate = new DateTime($row['expiry_date']);
                $formattedExpiryDate = $expiryDate->format('d.m.Y');

                $appointment = new Appointment($row['id'], $row['title'], $row['location'], $formattedDate, $formattedExpiryDate);
                $appointments[] = $appointment;
            }
            return $appointments;

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
        $result = $db->query("SELECT id, date, time, (SELECT COUNT(*) FROM user_votes 
                                   WHERE fk_selected_date_id = selectable_dates.id) as votes FROM selectable_dates WHERE fk_appointment_id = '$appointment_id'");

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


        return $result;
    }

    private function getUserVotes($appointment_id)
    {
        $db = new DB();
        $appointment_id = $db->escape($appointment_id);
        $result = $db->query("SELECT uv.id as id, uv.username as username, uv.comment as comment, sd.date as selected_date, sd.time as selected_time FROM user_votes uv JOIN selectable_dates sd ON uv.fk_selected_date_id = sd.id WHERE sd.fk_appointment_id = '$appointment_id'");

        if (!$result)
        {
            return false;
        }
        foreach ($result as &$row) {
            $datetime = new DateTime($row['selected_date'] . ' ' . $row['selected_time']);
            $row['selected_date'] = $datetime->format('d.m.Y');
            $row['selected_time'] = $datetime->format('H:i');
        }

        return $result;
    }



    public function submitVote($appointmentId, $username, $selectedDate, $selectedTime, $comment)
    {
        $db = new DB();
        $appointmentId = $db->escape($appointmentId);
        $username = $db->escape($username);
        $comment = $db->escape($comment);

        // Konvertiere das Datum und die Uhrzeit in das richtige Format für die Datenbank
        $selectedDateTime = DateTime::createFromFormat('d.m.Y H:i', $selectedDate . ' ' . $selectedTime);
        $formattedDate = $selectedDateTime->format('Y-m-d');
        $formattedTime = $selectedDateTime->format('H:i:s');

        // Get the selected date ID from the selectable_dates table
        $query = "SELECT id FROM selectable_dates WHERE date = '$formattedDate' AND time = '$formattedTime' AND fk_appointment_id = '$appointmentId'";
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
