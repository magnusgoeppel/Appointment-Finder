# Appointment Finder
Diese Webanwendung bietet eine umfassende Lösung zur Verwaltung von Terminen. Benutzer können Termine erstellen, ansehen, darüber abstimmen und sie löschen. Die Anwendung nutzt eine Kombination aus Frontend-Technologien (HTML, CSS, Bootstrap, JavaScript, jQuery) und einem PHP-basierten Backend, um eine dynamische Benutzererfahrung zu ermöglichen.

## Funktionen
- Terminerstellung: Benutzer können neue Termine mit Details wie Titel, Ort, Beschreibung, Dauer und abstimmungsfähigen Daten erstellen.
- Terminanzeige: Termine werden in einer Liste angezeigt, wobei Optionen zur Anzeige weiterer Details, zur Abstimmung und zum Löschen bereitstehen.
- Abstimmung über Termine: Benutzer können ihre Präferenzen für Terminoptionen abgeben, indem sie über verschiedene vorgeschlagene Zeiten abstimmen.
- Detailansicht: Jeder Termin kann erweitert werden, um zusätzliche Informationen und Abstimmungsoptionen anzuzeigen.
- Löschfunktion: Termine können aus der Liste entfernt werden.


## Voraussetzungen
- PHP-Server (z.B. XAMPP, WAMP, LAMP)
- MySQL-Datenbankserver
- Webbrowser (z.B. Chrome, Firefox)
- Installation und Einrichtung

## Ausführung

- Stellen Sie sicher, dass PHP und MySQL auf Ihrem Server installiert und konfiguriert sind.
- Starten Sie Ihren Apache- und MySQL-Server über Ihre Serververwaltungssoftware.

### Datenbank einrichten:

- Erstellen Sie eine neue Datenbank namens appointmentfinder.
- Importieren Sie das bereitgestellte SQL-Skript in Ihre Datenbank, um die erforderlichen Tabellen zu erstellen.

### Projekt konfigurieren:

- Klone oder lade das Projekt in das Wurzelverzeichnis deines Webservers herunter.
- Öffne die DB.php-Datei und aktualisiere die Datenbankverbindungseinstellungen entsprechend deiner Serverkonfiguration.

### Anwendung starten:

- Öffne einen Webbrowser und navigiere zur Startseite der Anwendung (z.B. http://localhost/DeinProjektverzeichnis/).

## Nutzung
- Neuen Termin erstellen: Klicken Sie auf die Schaltfläche "Neuen Termin erstellen" und füllen Sie das Formular mit den erforderlichen Termininformationen aus.
- Termine ansehen: Die Startseite zeigt alle erstellten Termine in einer Liste an.
- Details ansehen und abstimmen: Klicken Sie auf einen Termin, um Details anzuzeigen und Ihre Stimme für verfügbare Termine abzugeben.
- Termin löschen: Klicken Sie auf das Löschsymbol neben einem Termin, um ihn zu entfernen.