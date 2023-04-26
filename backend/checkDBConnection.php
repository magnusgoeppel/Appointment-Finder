<?php
include("db/db.php");

$db = new DB();

if ($db->checkDBConnection())
{
    echo "Datenbankverbindung: Erfolgreich";
}
else
{
    echo "Datenbankverbindung: Fehlgeschlagen";
}
