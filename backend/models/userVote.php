<?php

class UserVote
{
    public $id;
    public $appointment_id;
    public $username;
    public $comment;

    public $selected_dates;

    public function __construct($id, $appointment_id, $username, $comment, $selected_dates)
    {
        $this -> id = $id;
        $this -> appointment_id = $appointment_id;
        $this -> username = $username;
        $this -> comment = $comment;
        $this -> selected_dates = $selected_dates;
    }
}

