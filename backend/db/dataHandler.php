<?php
include( __DIR__ . '/../models/appointment.php');
include(__DIR__ . '/db.php');

class DataHandler
{
    public function queryAppointments()
    {
        return $this->getAppointmentData();
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

            $expiryDate = new DateTime($row['expiry_date']);
            $formattedExpiryDate = $expiryDate->format('d.m.Y');

            $appointment = new Appointment($row['id'], $row['title'], $row['location'], /*$formattedDate,*/ $formattedExpiryDate);
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
        $result = $db->query("SELECT selectable_dates.id, selectable_dates.date, selectable_dates.time, COUNT(user_selected_dates.id) as votes
                      FROM selectable_dates
                      LEFT JOIN user_selected_dates ON selectable_dates.id = user_selected_dates.fk_selectable_dates_id
                      WHERE selectable_dates.fk_appointment_id = '$appointment_id'
                      GROUP BY selectable_dates.id, selectable_dates.date, selectable_dates.time");


        if (!$result) {
            return false;
        }
        foreach ($result as &$row) {
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
        $result = $db->query("SELECT uv.id as id, uv.username as username, uv.comment as comment, sd.date as selected_date, sd.time as selected_time
                                  FROM user_votes uv
                                  JOIN user_selected_dates usd ON uv.id = usd.fk_user_vote_id
                                  JOIN selectable_dates sd ON usd.fk_selectable_dates_id = sd.id
                                  WHERE uv.fk_appointment_id = '$appointment_id'");



        if (!$result) {
            return false;
        }
        foreach ($result as &$row) {
            $datetime = new DateTime($row['selected_date'] . ' ' . $row['selected_time']);
            $row['selected_date'] = $datetime->format('d.m.Y');
            $row['selected_time'] = $datetime->format('H:i');
        }

        return $result;
    }

    public function submitSelectedDates($userVoteId, $selectedDates)
    {
        $db = new DB();
        $userVoteId = $db->escape($userVoteId);
        $success = true;

        foreach ($selectedDates as $selectedDate) {
            $formattedDate = $selectedDate['date'];

            $dateObj = DateTime::createFromFormat('d.m.Y', $formattedDate);
            $dateForDb = $dateObj->format('Y-m-d');

            // Get the selected date ID from the selectable_dates table
            $query = "SELECT id FROM selectable_dates WHERE date = '$dateForDb' AND fk_appointment_id = '$appointmentId'";
            $result = $db->query($query);

            if ($result && count($result) > 0) {
                $selectedDateId = $result[0]['id'];

                // Insert the selected date into the user_selected_date table
                $query = "INSERT INTO user_selected_dates (fk_user_vote_id, fk_selectable_date_id) VALUES ('$userVoteId', '$selectedDateId')";
                $result = $db->query($query);

                if (!$result) {
                    $success = false;
                    break;
                }
            } else {
                $success = false;
                break;
            }
        }

        return $success;
    }
    public function submitUserVote($appointmentId, $username, $selectedDates, $comment)
    {
        $db = new DB();
        $appointmentId = $db->escape($appointmentId);
        $username = $db->escape($username);
        $comment = $db->escape($comment);

        $result = $db->query("INSERT INTO user_votes (fk_appointment_id, username, comment) VALUES ('$appointmentId', '$username', '$comment')");

        if ($result) {
            return $db->getLastInsertId();
        } else {
            return false;
        }
    }
}
