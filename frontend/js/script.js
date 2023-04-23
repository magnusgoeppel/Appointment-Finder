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
    var output = "<table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>Details</th>\n                    <th>ID</th>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th>Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                </tr>\n            </thead>\n    <tbody>";
    for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
        var appointment = appointments_1[_i];
        var status_1 = "Offen";
        var currentDate = new Date();
        var expiryDate = parseGermanDate(appointment.expiry_date);
        console.log(currentDate, expiryDate);
        if (currentDate > expiryDate) {
            status_1 = "Abgelaufen";
        }
        output += "\n            <tr class=\"appointment-row\" data-appointment-id=\"".concat(appointment.id, "\">\n                <td><img class=\"toggle-details\" data-appointment-id=\"").concat(appointment.id, "\" src=\"img/expand.png\" alt=\"Toggle details\"></td>\n                <td>").concat(appointment.id, "</td>\n                <td>").concat(appointment.title, "</td>\n                <td>").concat(appointment.location, "</td>\n                <td>").concat(appointment.expiry_date, "</td>\n                <td>").concat(status_1, "</td>\n            </tr>\n            <tr class=\"details-row\" data-appointment-id=\"").concat(appointment.id, "\" style=\"display: none;\">\n                <td colspan=\"7\">\n                    <div class=\"appointment-details\"></div>\n                </td>\n            </tr>\n        ");
    }
    output += "</tbody>" +
        "</table>";
    $(".appointments-list").html(output);
    // Event Listener zum Klicken auf das Bild hinzufügen
    $('.toggle-details').click(function () {
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
            console.log('AppointmentID:', appointmentId, 'status:', status, 'detailsRow:', detailsRow);
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}
function updateAppointmentDetails(appointmentId, details, status) {
    var output = '<div class="card"> <div class="card-body"> <h4 class="card-title">Voting</h4> <ul class="list-group"> ';
    for (var _i = 0, _a = details.selectable_dates; _i < _a.length; _i++) {
        var selectableDate = _a[_i];
        output += "\n        <li class=\"list-group-item\">\n            ".concat(selectableDate.date, "    \n            ").concat(selectableDate.time, "\n            <span class=\"badge bg-primary rounded-pill\">").concat(selectableDate.votes, " Stimmen</span>\n        </li>\n    ");
    }
    output += "</ul>";
    output += "\n\n    <form class=\"appointment-form\" data-appointment-id=\"".concat(appointmentId, "\">\n        <h4 class=\"card-title mt-3\">Abstimmen</h4>\n        <div class=\"card\">\n            <div class=\"card-body\">\n        <div class=\"mb-3\">\n            <label for=\"username-").concat(appointmentId, "\" class=\"form-label\">Name</label>\n            <input type=\"text\" class=\"form-control\" id=\"username-").concat(appointmentId, "\" name=\"username\" required>\n        </div>\n    <!--TO-DO Checkboxes f\u00FCr die Termine-->\n    <div class=\"mb-3\">\n        <label for=\"date-").concat(appointmentId, "\" class=\"form-label\">Terminoptionen</label>\n        <div id=\"date-").concat(appointmentId, "\">");
    for (var _b = 0, _c = details.selectable_dates; _b < _c.length; _b++) {
        var selectableDate = _c[_b];
        output += "\n            <div class=\"form-check\">\n                <input class=\"form-check-input date-checkbox-".concat(appointmentId, "\" type=\"checkbox\" value=\"").concat(selectableDate.date, " ").concat(selectableDate.time, "\" id=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\" name=\"date\" data-date=\"").concat(selectableDate.date, "\" data-time=\"").concat(selectableDate.time, "\">\n                <label class=\"form-check-label\" for=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\">\n                    ").concat(selectableDate.date, ", ").concat(selectableDate.time, " Uhr\n                </label>\n            </div>");
    }
    output += "</div>";
    output += "\n        </select>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"comment-".concat(appointmentId, "\" class=\"form-label\">Kommentar</label>\n            <textarea class=\"form-control\" id=\"comment-").concat(appointmentId, "\" name=\"comment\" rows=\"3\" placeholder=\"optional\"></textarea>\n        </div>");
    output += "</form>";
    if (status === "Abgelaufen") {
        output += "<div class=\"alert alert-warning\" role=\"alert\">Dieser Termin ist abgelaufen. Abstimmung nicht mehr m\u00F6glich.</div>";
    }
    else {
        output += "<button type=\"button\" id=\"submit-vote-".concat(appointmentId, "\" class=\"btn btn-primary\" disabled>Abstimmen</button>");
    }
    output += "     </div></div><div>\n    </div></form>";
    output += '</ul><br/>';
    output += "\n            <h4 class\"card-title\">Bisherige Abstimmungen und Kommentare</h4>\n<ul class=\"list-group\">\n";
    for (var _d = 0, _e = details.user_votes; _d < _e.length; _d++) {
        var userVote = _e[_d];
        var hasComment = userVote.comment.trim() !== '';
        output += "\n<li class=\"list-group-item\">\n    <strong>".concat(userVote.username).concat(hasComment ? ' :' : '', "</strong> <span class=\"user-comment\">").concat(userVote.comment, "</span>\n    <br>\n    <small>Gew\u00E4hltes Datum: ").concat(userVote.selected_date, ", ").concat(userVote.selected_time, " Uhr</small>\n</li>\n");
    }
    $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).html(output);
    $("#submit-vote-".concat(appointmentId)).on('click', function () {
        var username = $("#username-".concat(appointmentId)).val();
        var comment = $("#comment-".concat(appointmentId)).val();
        var selectedDates = [];
        $(".date-checkbox-".concat(appointmentId, ":checked")).each(function () {
            var date = $(this).data('date');
            var parsedDate = parseGermanDate(date);
            var time = $(this).data('time');
            selectedDates.push({ date: parsedDate, time: time });
        });
        submitVote(appointmentId, username, comment, selectedDates);
    });
    // Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons hinzufügen
    $("#username-".concat(appointmentId)).on('input', function () {
        if ($(this).val()) {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', false);
        }
        else {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', true);
        }
    });
}
function submitVote(appointmentId, username, comment, selectedDates) {
    console.log(appointmentId, username, comment, selectedDates);
    $.ajax({
        url: '../../backend/serviceHandler.php',
        type: 'GET',
        data: {
            method: 'submitUserVote',
            param: {
                appointment_id: appointmentId,
                username: username,
                selected_dates: selectedDates,
                comment: comment
            }
        },
        dataType: 'json',
        success: function (response) {
            console.log('Ihre Abstimmung wurde erfolgreich gespeichert!');
        },
        error: function () {
            console.error('Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es erneut.');
        }
    });
}
function parseGermanDate(dateString) {
    var _a = dateString.split('.'), day = _a[0], month = _a[1], year = _a[2];
    return new Date(year, month - 1, day);
}
