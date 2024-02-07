$(document).ready(function () {
    // Lade die Termine
    loadAppointments();
    // Event Listener für den newAppointment-Button hinzufügen
    $("#title, #location, #description, #duration, #selectable_dates, #expiry_date").on("input", updateSubmitButtonState);
    document.getElementById("new-appointment-btn").addEventListener("click", submitNewAppointment);
});
// Lade die Termine
function loadAppointments() {
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointments' },
        dataType: 'json',
        success: function (data) {
            // Anzeigen der Appointments
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
// Anzeigen der Appointments
function displayAppointments(appointments) {
    var output = "<table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>Details</th>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th class=\"shift-left\">Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                    <th class=\"shift-left_light\">L\u00F6schen</th>\n                </tr>\n            </thead>\n    <tbody>";
    for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
        var appointment = appointments_1[_i];
        var status_1 = "Offen";
        var currentDate = new Date();
        var expiryDate = parseGermanDate(appointment.expiry_date);
        console.log(currentDate);
        console.log(expiryDate);
        if (currentDate > expiryDate) {
            status_1 = "Abgelaufen";
        }
        output += "\n            <tr class=\"appointment-row\" data-appointment-id=\"".concat(appointment.id, "\">\n                <td><img class=\"toggle-details\" data-appointment-id=\"").concat(appointment.id, "\" src=\"img/expand.png\" alt=\"Toggle details\"></td>\n                <td>").concat(appointment.title, "</td>\n                <td>").concat(appointment.location, "</td>\n                <td>").concat(appointment.expiry_date, "</td>\n                <td>").concat(status_1, "</td>\n                <td><img class=\"deletePic\" id=\"").concat(appointment.id, "\" src=\"img/delete.png\"></td>\n            </tr>\n            <tr class=\"details-row\" data-appointment-id=\"").concat(appointment.id, "\" style=\"display: none;\">\n                <td colspan=\"7\">\n                    <div class=\"appointment-details\"></div>\n                </td>\n            </tr>\n        ");
    }
    output += "</tbody>" +
        "</table>";
    $(".appointments-list").html(output);
    // Event Listener zum Klicken auf die Details
    $('.toggle-details').click(function () {
        var appointmentId = $(this).data('appointment-id');
        var detailsRow = $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]"));
        if (detailsRow.is(':visible')) {
            // Verstecke die Detailansicht
            detailsRow.hide();
            $(this).attr('src', 'img/expand.png'); // Ändere das Bild zu "expand.png", wenn die Detailansicht geschlossen ist
        }
        else {
            // Zeige die Detailansicht an
            detailsRow.show();
            // Ändere das Bild zu "collapse.png", wenn die Detailansicht geöffnet ist
            $(this).attr('src', 'img/collapse.png');
            loadAppointmentDetails(appointmentId);
        }
    });
    // Event Listener zum Klicken auf das Löschen eines Termins
    $('.deletePic').click(function () {
        var deleteAppointmentId = this.id;
        console.log(deleteAppointmentId);
        deleteAppointment(deleteAppointmentId);
    });
}
// Löschen eines Termins
function loadAppointmentDetails(appointmentId) {
    var detailsRow = $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]"));
    var status = detailsRow.prev('.appointment-row').find('td:nth-last-child(2)').text();
    console.log();
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointmentDetails', param: appointmentId },
        dataType: 'json',
        success: function (data) {
            console.log(data);
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
// Aktualisiert den "Submit" Button-Zustand basierend auf der Vollständigkeit des Formulars
function updateSubmitButtonState() {
    var allFieldsFilled = checkFormNewAppointment();
    $("#new-appointment-btn").prop("disabled", !allFieldsFilled);
}
// Überprüfe, ob alle Felder ausgefüllt sind
function checkFormNewAppointment() {
    var title = $("#title").val();
    var location = $("#location").val();
    var description = $("#description").val();
    var duration = $("#duration").val();
    var selectable_dates = $("#selectable_dates").val();
    var expiry_date = $("#expiry_date").val();
    // Überprüfen Sie, ob alle Felder ausgefüllt sind, und geben Sie true oder false zurück
    return title && location && description && duration && selectable_dates && expiry_date;
}
// Anzeigen der Details eines Termins
function updateAppointmentDetails(appointmentId, details, status) {
    var output = '';
    // Beschreibung
    output += "<div class=\"card\"> <div class=\"card-body\">\n     <form class=\"description-form\">\n                <h4 class=\"card-title\">Beschreibung</h4>\n                    <ul class=\"list-group\">\n                        <li class=\"list-group-item\">       \n                            <span>".concat(details.description, "</span>\n                        </li>\n                    </ul>\n                </form>\n               \n       <!-- Dauer -->\n        <form class=\"duration-form\">      \n            <h4 class=\"card-title mt-3\">Dauer</h4>       \n            <ul class=\"list-group\">\n            \n                <li class=\"list-group-item\">\n                    <span>").concat(details.duration, " Minuten</span>\n                </li>\n            </ul>\n        </form>");
    // Voting
    output += '<h4 class="card-title mt-3">Voting</h4> <ul class="list-group"> ';
    for (var _i = 0, _a = details.selectable_dates; _i < _a.length; _i++) {
        var selectableDate = _a[_i];
        output += "\n        <li class=\"list-group-item\">\n            ".concat(selectableDate.date, "    \n            ").concat(selectableDate.time, "\n            <span class=\"badge bg-primary rounded-pill\">").concat(selectableDate.votes, " Stimmen</span>\n        </li>\n    ");
    }
    output += "</ul>";
    // Abstimmung
    output += "<form class=\"appointment-form\" data-appointment-id=\"".concat(appointmentId, "\">\n                <h4 class=\"card-title mt-3\">Abstimmen</h4>\n                <div class=\"card\">\n                    <div class=\"card-body\">\n                <div class=\"mb-3\">\n                    <label for=\"username-").concat(appointmentId, "\" class=\"form-label\">Name</label>\n                    <input type=\"text\" class=\"form-control\" id=\"username-").concat(appointmentId, "\" name=\"username\" required>\n                </div>\n   \n    <div class=\"mb-3\">\n        <label for=\"date-").concat(appointmentId, "\" class=\"form-label\">Terminoptionen</label>\n        <div id=\"date-").concat(appointmentId, "\">");
    for (var _b = 0, _c = details.selectable_dates; _b < _c.length; _b++) {
        var selectableDate = _c[_b];
        output += "\n            <div class=\"form-check\">\n                <input class=\"form-check-input date-checkbox-".concat(appointmentId, "\" type=\"checkbox\" value=\"").concat(selectableDate.date, " ").concat(selectableDate.time, "\" id=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\" name=\"date\" data-date=\"").concat(selectableDate.date, "\" data-time=\"").concat(selectableDate.time, "\">\n                <label class=\"form-check-label\" for=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\">\n                    ").concat(selectableDate.date, ", ").concat(selectableDate.time, " Uhr\n                </label>\n            </div>");
    }
    output += "</div>";
    output += "\n        </select>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"comment-".concat(appointmentId, "\" class=\"form-label\">Kommentare</label>\n            <textarea class=\"form-control\" id=\"comment-").concat(appointmentId, "\" name=\"comment\" rows=\"3\" placeholder=\"optional\"></textarea>\n        </div>");
    output += "</form>";
    // Wenn der Termin noch nicht abgelaufen ist, kann abgestimmt werden
    if (status === "Abgelaufen") {
        output += "<div class=\"alert alert-warning\" role=\"alert\">Dieser Termin ist abgelaufen. Abstimmung nicht mehr m\u00F6glich.</div>";
    }
    else {
        output += "<button type=\"button\" id=\"submit-vote-".concat(appointmentId, "\" class=\"btn btn-primary\" disabled>Abstimmen</button>");
    }
    output += "     </div></div><div>\n    </div></form>";
    output += '</ul><br/>';
    output += "\n            <h4 class\"card-title\">Kommentare</h4>\n            <ul class=\"list-group\">";
    var uniqueUsernames = {};
    // Generieren der Liste der Kommentare
    for (var _d = 0, _e = details.user_votes; _d < _e.length; _d++) {
        var userVote = _e[_d];
        var hasComment = userVote.comment.trim() !== '';
        if (hasComment && !uniqueUsernames[userVote.username]) {
            uniqueUsernames[userVote.username] = true;
            output += "\n        <li class=\"list-group-item\">\n            <strong>".concat(userVote.username, ":</strong>\n            <br>\n            <span class=\"user-comment\">").concat(userVote.comment, "</span>\n        </li>\n        ");
        }
    }
    output += "</ul>";
    // Anzeigen der Details
    $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).html(output);
    // Die Funktion checkVoteButtonStatus wird aufgerufen, um den Abstimm-Button zu aktivieren/deaktivieren
    function checkVoteButtonStatus() {
        var anyCheckboxChecked = $(".date-checkbox-".concat(appointmentId, ":checked")).length > 0;
        var usernameNotEmpty = $("#username-".concat(appointmentId)).val() !== '';
        if (usernameNotEmpty && anyCheckboxChecked) {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', false);
        }
        else {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', true);
        }
    }
    $("#username-".concat(appointmentId)).on('input', checkVoteButtonStatus);
    // Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons
    $(".date-checkbox-".concat(appointmentId)).on('change', checkVoteButtonStatus);
    // Event Listener zum Absenden des Abstimm-Formulars
    $("#submit-vote-".concat(appointmentId)).on('click', function () {
        console.log("submit vote");
        var username = $("#username-".concat(appointmentId)).val();
        var comment = $("#comment-".concat(appointmentId)).val();
        var selectedDates = [];
        $(".date-checkbox-".concat(appointmentId, ":checked")).each(function () {
            var date = $(this).data('date');
            var parsedDate = parseDate(date);
            var time = $(this).data('time');
            selectedDates.push({ date: parsedDate, time: time });
        });
        submitVote(appointmentId, username, comment, selectedDates, function () {
            loadAppointmentDetails(appointmentId);
        });
    });
}
// Funktion zum Speichern der Abstimmung
function submitVote(appointmentId, username, comment, selectedDates, callback) {
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
            if (callback) {
                callback();
            }
            console.log('Ihre Abstimmung wurde erfolgreich gespeichert!');
            console.log(response);
            alert('Ihre Abstimmung wurde erfolgreich gespeichert!');
        },
        error: function () {
            console.error('Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es erneut.');
            alert('Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es erneut.');
        }
    });
}
// Funktion zum Speichern eines neuen Termins
function submitNewAppointment(event) {
    event.preventDefault();
    // Funktion zum Konvertieren des Datums in das richtige Format
    function convertDateTimeFormat(dateTimeString) {
        var _a = dateTimeString.split(', '), datePart = _a[0], timePart = _a[1];
        var _b = datePart.split('.'), day = _b[0], month = _b[1], year = _b[2];
        var _c = timePart.split(' '), time = _c[0], uhr = _c[1];
        return "".concat(year, "-").concat(month, "-").concat(day, ", ").concat(time, ".00 ").concat(uhr);
    }
    var title = $("#title").val();
    var location = $("#location").val();
    var description = $("#description").val();
    var duration = $("#duration").val();
    var selectable_dates_unformed = $("#selectable_dates").val();
    var selectable_dates = typeof selectable_dates_unformed === 'string' ? selectable_dates_unformed.split('\n').map(function (dateTimeString) { return convertDateTimeFormat(dateTimeString); }).join('\n') : '';
    var expiry_date = parseDate($("#expiry_date").val());
    var data = {
        method: "createNewAppointment",
        param: {
            title: title,
            location: location,
            description: description,
            duration: duration,
            selectable_dates: selectable_dates,
            expiry_date: expiry_date,
        },
    };
    console.log(data);
    $.ajax({
        url: "../../backend/serviceHandler.php",
        type: "GET",
        data: data,
        dataType: "json",
        success: function (result) {
            console.log(result);
            alert("Neues Appointment erfolgreich erstellt!");
            window.location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error, "Status:", status, "xhr:", xhr);
            console.log("Raw response:", xhr.responseText);
            alert("Fehler beim Speichern des Appointments. Bitte versuchen Sie es erneut.");
        },
    });
}
// Funktion zum Formatieren des Datums
function parseGermanDate(dateString) {
    var _a = dateString.split('.'), day = _a[0], month = _a[1], year = _a[2];
    return new Date(year, month - 1, day);
}
// Funktion zum Formatieren des Datums
function parseDate(dateString) {
    var _a = dateString.split('.'), day = _a[0], month = _a[1], year = _a[2];
    return "".concat(year, "-").concat(month, "-").concat(day);
}
// Funktion zum Löschen eines Termins
function deleteAppointment(appointmentId) {
    var data = {
        method: 'deleteAppointment',
        param: { appointmentId: appointmentId }
    };
    console.log(data);
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: data,
        dataType: 'json',
        success: function () {
            alert('Termin erfolgreich gelöscht.');
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            console.log('Raw response:', jqXHR.responseText);
            alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
        }
    });
}
