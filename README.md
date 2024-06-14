# Appointment Finder

This web application provides a comprehensive solution for managing appointments. Users can create, view, vote on, and delete appointments. The application uses a combination of frontend technologies (HTML, CSS, Bootstrap, JavaScript, jQuery) and a PHP-based backend to offer a dynamic user experience.

## Features

### Appointment Creation
- Users can create new appointments with details such as title, location, description, duration, and votable dates.

### Appointment Display
- Appointments are displayed in a list with options to view more details, vote, and delete.

### Voting on Appointments
- Users can submit their preferences for appointment options by voting on various proposed times.

### Detailed View
- Each appointment can be expanded to show additional information and voting options.

### Deletion Function
- Appointments can be removed from the list.

## Requirements
- PHP Server (e.g., XAMPP, WAMP, LAMP)
- MySQL Database Server
- Web Browser (e.g., Chrome, Firefox)

## Installation and Setup

### Database Setup

1. Ensure PHP and MySQL are installed and configured on your server.
2. Start your Apache and MySQL server using your server management software.
3. Create a new database named `appointmentfinder`.
4. Import the provided SQL script into your database to create the required tables.

### Project Configuration

1. Clone or download the project into the root directory of your web server.
2. Open the `DB.php` file and update the database connection settings according to your server configuration.

### Running the Application

1. Open a web browser and navigate to the home page of the application (e.g., `http://localhost/YourProjectDirectory/`).

## Usage

### Creating a New Appointment

1. Click the "Create New Appointment" button.
2. Fill out the form with the required appointment information.

### Viewing Appointments

- The home page displays all created appointments in a list.

### Viewing Details and Voting

1. Click on an appointment to view details.
2. Submit your vote for available times.

### Deleting an Appointment

- Click the delete icon next to an appointment to remove it.
