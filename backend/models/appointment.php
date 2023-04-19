<?php
class Appointment
{
    public $id;
    public $title;
    public $location;
    public $date;
    public $expiry_date;

    function __construct($id, $title, $location, $date, $expiry_date)
    {
        $this -> id = $id;
        $this -> title = $title;
        $this -> location = $location;
        $this -> date = $date;
        $this -> expiry_date = $expiry_date;
    }
}
