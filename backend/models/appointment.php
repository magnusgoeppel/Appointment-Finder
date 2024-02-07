<?php
class Appointment
{
    public $id;
    public $title;
    public $location;
    public $expiry_date;

    function __construct($id, $title, $location, $expiry_date)
    {
        $this->id = $id;
        $this->title = $title;
        $this->location = $location;
        $this->expiry_date = $expiry_date;
    }
}