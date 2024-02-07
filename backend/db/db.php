<?php
class DB
{
    private $host = "localhost";
    private $user = "bif2webscriptinguser";
    private $password = "bif2021";
    private $database = "appointmentfinder";
    private $connection;

    public function __construct()
    {
        $this->connect();
    }

    // Connection zur Datenbank aufbauen
    private function connect()
    {
        $this->connection = new mysqli($this->host, $this->user, $this->password, $this->database);
        $this->connection->set_charset("utf8");

        if ($this->connection->connect_error)
        {
            die("Verbindung fehlgeschlagen: " . $this->connection->connect_error);
        }
    }

    // Funktion zum Ausführen von SQL-Statements
    public function query($sql)
    {
        $result = $this->connection->query($sql);

        if ($result === TRUE)
        {
            return $this->connection->insert_id;
        }
        else if ($result === FALSE)
        {
            return FALSE;
        }
        else
        {
            $data = array();

            while ($row = $result->fetch_assoc())
            {
                $data[] = $row;
            }
            return $data;
        }
    }

    // Funktion gegen SQL-Injection
    public function escape($value)
    {
        return $this->connection->real_escape_string($value);
    }

    // Connection zur Datenbank schließen
    public function close()
    {
        $this->connection->close();
    }

    // Die ID des zuletzt eingefügten Datensatzes zurückgeben
    public function getLastInsertedId()
    {
        return $this->connection-> insert_id;
    }
}

