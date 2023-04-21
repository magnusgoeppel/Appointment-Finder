$(document).ready(function () {
    loadAppointments();
});
function loadAppointments() {
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointments' },
        dataType: 'json',
        success: function (data) {
            displayAppointments(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}
function displayAppointments(appointments) {
    console.log(appointments);
    // Konvertiere das Array von Arrays in ein flaches Array
    var flatAppointments = [].concat(appointments);
    var output = "<table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>Details</th>\n                    <th>ID</th>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th>Datum</th>\n                    <th>Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                </tr>\n            </thead>\n    <tbody>";
    for (var _i = 0, flatAppointments_1 = flatAppointments; _i < flatAppointments_1.length; _i++) {
        var appointment = flatAppointments_1[_i];
        var status_1 = "Offen";
        var currentDate = new Date();
        var expiryDate = new Date(appointment.expiry_date);
        if (currentDate > expiryDate) {
            status_1 = "Abgelaufen";
        }
        output += "\n            <tr class=\"appointment-row\" data-appointment-id=\"".concat(appointment.id, "\">\n                <td><img class=\"toggle-details\" data-appointment-id=\"").concat(appointment.id, "\" src=\"img/expand.png\" alt=\"Toggle details\"></td>\n                <td>").concat(appointment.id, "</td>\n                <td>").concat(appointment.title, "</td>\n                <td>").concat(appointment.location, "</td>\n                <td>").concat(appointment.date, "</td>\n                <td>").concat(appointment.expiry_date, "</td>\n                <td>").concat(status_1, "</td>\n            </tr>\n            <tr class=\"details-row\" data-appointment-id=\"").concat(appointment.id, "\" style=\"display: none;\">\n                <td colspan=\"7\">\n                    <div class=\"appointment-details\"></div>\n                </td>\n            </tr>\n        ");
    }
    output += "</tbody>" +
        "</table>";
    $(".appointments-list").html(output);
    // Event Listener zum Klicken auf das Bild hinzufügen
    $('.toggle-details').click(function ()
    {
        var appointmentId = $(this).data('appointment-id');
        var detailsRow = $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]"));
        if (detailsRow.is(':visible')) {
            detailsRow.hide();
            $(this).attr('src', 'img/expand.png'); // Ändere das Bild zu "expand.png", wenn die Detailansicht geschlossen ist
        }
        else {
            detailsRow.show();
            $(this).attr('src', 'img/collapse.png'); // Ändere das Bild zu "collapse.png", wenn die Detailansicht geöffnet ist
            loadAppointmentDetails(appointmentId);
        }
    });
    // Event Listener zum Absenden des Formulars hinzufügen
    $('.appointment-form').submit(function (event) {
        event.preventDefault();
        var appointmentId = $(this).data('appointment-id');
        var username = $("#username-".concat(appointmentId)).val();
        var selectedDate = $("#date-".concat(appointmentId)).val();
        var comment = $("#comment-".concat(appointmentId)).val();
        submitVote(appointmentId, username, selectedDate, comment);
    });
}
function loadAppointmentDetails(appointmentId) {
    var detailsRow = $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]"));
    var status = detailsRow.prev('.appointment-row').find('td:last-child').text();
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointmentDetails', param: appointmentId },
        dataType: 'json',
        success: function (data) {
            updateAppointmentDetails(appointmentId, data, status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}
function updateAppointmentDetails(appointmentId, details, status) {
    var output = "\n        <div class=\"card\">\n            <div class=\"card-body\">\n                <h4 class=\"card-title\">Terminoptionen</h4>\n                <ul class=\"list-group\">\n    ";
    for (var _i = 0, _a = details.selectable_dates; _i < _a.length; _i++) {
        var selectableDate = _a[_i];
        output += "\n            <li class=\"list-group-item\">\n                ".concat(selectableDate.date, "\n                <span class=\"badge bg-primary rounded-pill\">").concat(selectableDate.votes, " Stimmen</span>\n            </li>\n        ");
    }
    output += '</ul><br/>';
    output += "\n                <h4 class=\"card-title\">Bisherige Abstimmungen und Kommentare</h4>\n                <ul class=\"list-group\">\n    ";
    for (var _b = 0, _c = details.user_votes; _b < _c.length; _b++) {
        var userVote = _c[_b];
        output += "\n        <li class=\"list-group-item\">\n            <strong>".concat(userVote.username, ":</strong> <span class=\"user-comment\">").concat(userVote.comment, "</span>\n            <br>\n            <small>Gew\u00E4hltes Datum: ").concat(userVote.selected_date, "</small>\n        </li>\n    ");
    }
    output += "</ul>";
    output += "\n    <form class=\"appointment-form\" data-appointment-id=\"".concat(appointmentId, "\">\n        <h4 class=\"card-title mt-3\">Abstimmen</h4>\n        <div class=\"mb-3\">\n            <label for=\"username-").concat(appointmentId, "\" class=\"form-label\">Name</label>\n            <input type=\"text\" class=\"form-control\" id=\"username-").concat(appointmentId, "\" name=\"username\" required>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"date-").concat(appointmentId, "\" class=\"form-label\">Terminoptionen</label>\n            <select class=\"form-control\" id=\"date-").concat(appointmentId, "\" name=\"date\" required>");
    for (var _d = 0, _e = details.selectable_dates; _d < _e.length; _d++) {
        var selectableDate = _e[_d];
        output += "<option value=\"".concat(selectableDate.date, "\">").concat(selectableDate.date, "</option>");
    }
    output += "\n            </select>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"comment-".concat(appointmentId, "\" class=\"form-label\">Kommentar</label>\n            <textarea class=\"form-control\" id=\"comment-").concat(appointmentId, "\" name=\"comment\" rows=\"3\"></textarea>\n        </div>");
    output += "</form>";
    if (status === "Abgelaufen") {
        output += "<div class=\"alert alert-warning\" role=\"alert\">Dieser Termin ist abgelaufen. Abstimmung nicht mehr m\u00F6glich.</div>";
    }
    else {
        output += "<button type=\"submit\" class=\"btn btn-primary\">Abstimmen</button>";
    }
    output += "     </div>\n        </div></form>";
    $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).html(output);
}
function submitVote(appointmentId, username, selectedDaten, comment) {
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'POST',
        data: {
            method: 'submitVote',
            param: {
                appointmentId: appointmentId,
                username: username,
                selectedDate: selectedDaten,
                comment: comment
            }
        },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                // Zeige Erfolgsmeldung an
                var html = '<div class="alert alert-success" role="alert">';
                html += 'Ihre Abstimmung wurde erfolgreich gespeichert.';
                html += '</div>';
                $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).prepend(html);
                // Aktualisiere die Detailansicht
                loadAppointmentDetails(appointmentId);
            }
            else {
                // Zeige Fehlermeldung an
                var html = '<div class="alert alert-danger" role="alert">';
                html += 'Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es später erneut.';
                html += '</div>';
                $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).prepend(html);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).prepend(html);
        }
    });
}
