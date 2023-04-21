<?php


class DB
{
    private $host = "localhost";
    private $user = "bif2webscriptinguser";
    private $password = "bif2023";
    private $database = "appointment_finder";
    private $connection;

    public function __construct()
    {
        $this->connect();
    }

    private function connect()
    {
        $this->connection = new mysqli($this->host, $this->user, $this->password, $this->database);

        if ($this->connection->connect_error)
        {
            die("Verbindung fehlgeschlagen: " . $this->connection->connect_error);
        }
        else
        {
            //
        }
    }

    public function query($sql)
    {
        $result = $this->connection->query($sql);

        if ($result === TRUE) {
            return $this->connection->insert_id;
        } else if ($result === FALSE) {
            return FALSE;
        } else {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            return $data;
        }
    }

    public function escape($value)
    {
        return $this->connection->real_escape_string($value);
    }

    public function close()
    {
        $this->connection->close();
    }
}

