-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 26. Apr 2023 um 23:54
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `appointmentfinder`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `duration` int(11) NOT NULL,
  `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `appointments`
--

INSERT INTO `appointments` (`id`, `title`, `location`, `description`, `duration`, `expiry_date`) VALUES
(1, 'Meeting', 'Conference Room', 'In diesem wichtigen Meeting werden wir den aktuellen Projektfortschritt besprechen, Herausforderungen identifizieren und gemeinsam Lösungsansätze entwickeln. Anschließend werden wir die nächsten Schritte und Meilensteine für eine effiziente und erfolgreiche Projektumsetzung planen.', 0, '2023-04-19'),
(2, 'Workshop', 'Training Room', 'In diesem interaktiven Workshop werden wir Techniken und Methoden zur Verbesserung der Teamkommunikation erlernen und üben. Themen wie aktives Zuhören, effektives Feedback und Konfliktlösungsstrategien stehen im Fokus, um die Zusammenarbeit und das Verständnis innerhalb des Teams zu fördern.', 0, '2023-04-30'),
(3, 'Team Lunch', 'Caferteria', 'Komm zu unserem Team Lunch in der Cafeteria! Genieße leckeres Essen, triff deine Kollegen und tausche Ideen aus. Eine großartige Gelegenheit, um sich zu vernetzen und eine angenehme Pause einzulegen. Offen für alle – lass es dir nicht entgehen!', 0, '2023-04-30');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `selectable_dates`
--

CREATE TABLE `selectable_dates` (
  `id` int(11) NOT NULL,
  `fk_appointment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `selectable_dates`
--

INSERT INTO `selectable_dates` (`id`, `fk_appointment_id`, `date`, `time`) VALUES
(1, 1, '2023-04-24', '14:30:00'),
(2, 1, '2022-04-24', '15:00:00'),
(3, 3, '2024-01-01', '11:00:00'),
(4, 2, '2023-04-30', '10:30:00'),
(5, 3, '2025-01-01', '09:43:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_selected_dates`
--

CREATE TABLE `user_selected_dates` (
  `id` int(11) NOT NULL,
  `fk_user_vote_id` int(11) NOT NULL,
  `fk_selectable_dates_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user_selected_dates`
--

INSERT INTO `user_selected_dates` (`id`, `fk_user_vote_id`, `fk_selectable_dates_id`) VALUES
(1, 1, 1),
(3, 22, 3),
(4, 22, 5),
(5, 23, 3),
(6, 23, 5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_votes`
--

CREATE TABLE `user_votes` (
  `id` int(11) NOT NULL,
  `fk_appointment_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user_votes`
--

INSERT INTO `user_votes` (`id`, `fk_appointment_id`, `username`, `comment`) VALUES
(1, 1, 'max1234', 'Top'),
(22, 3, 'maria91', ''),
(23, 3, 'hans19', '');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `selectable_dates`
--
ALTER TABLE `selectable_dates`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_selected_dates`
--
ALTER TABLE `user_selected_dates`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_votes`
--
ALTER TABLE `user_votes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT für Tabelle `selectable_dates`
--
ALTER TABLE `selectable_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `user_selected_dates`
--
ALTER TABLE `user_selected_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT für Tabelle `user_votes`
--
ALTER TABLE `user_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
