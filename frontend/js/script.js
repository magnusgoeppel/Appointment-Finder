$(document).ready(function () {
    loadAppointments();
    //checkFormNewAppointment();
    document.getElementById("new-appointment-btn").addEventListener("click", submitNewAppointment);
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
    $('.deletePic').click(function () {
        var deleteAppointmentId = this.id;
        console.log(deleteAppointmentId);
        deleteAppointment(deleteAppointmentId);
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
/*function checkFormNewAppointment()
{
    const title = $("#title").val();
    const location = $("#location").val();
    const description = $("#description").val();
    const duration = $("#duration").val();
    const selectable_dates = $("#selectable_dates").val();
    const expiry_date = $("#expiry_date").val();

    if (title && location && description && duration && selectable_dates && expiry_date) {
        $("#new-appointment-btn").prop("disabled", false);
    }
    else
    {
        $("#new-appointment-btn").prop("disabled", true);
    }
    $("#title, #location, #description, #duration, #selectable_dates, #expiry_date").on("input", checkFormNewAppointment);
    document.getElementById("new-appointment-btn").addEventListener("click", submitNewAppointment);
}*/
function updateAppointmentDetails(appointmentId, details, status) {
    var isExpired = status === "Abgelaufen";
    var output = '<div class="card"> <div class="card-body"> <h4 class="card-title">Voting</h4> <ul class="list-group"> ';
    for (var _i = 0, _a = details.selectable_dates; _i < _a.length; _i++) {
        var selectableDate = _a[_i];
        output += "\n        <li class=\"list-group-item\">\n            ".concat(selectableDate.date, "    \n            ").concat(selectableDate.time, "\n            <span class=\"badge bg-primary rounded-pill\">").concat(selectableDate.votes, " Stimmen</span>\n        </li>\n    ");
    }
    output += "</ul>";
    output += "\n\n    <form class=\"appointment-form\" data-appointment-id=\"".concat(appointmentId, "\">\n        <h4 class=\"card-title mt-3\">Abstimmen</h4>\n        <div class=\"card\">\n            <div class=\"card-body\">\n        <div class=\"mb-3\">\n            <label for=\"username-").concat(appointmentId, "\" class=\"form-label\">Name</label>\n            <input type=\"text\" class=\"form-control\" id=\"username-").concat(appointmentId, "\" name=\"username\" required ").concat(isExpired ? 'disabled' : '', ">\n        </div>\n   \n    <div class=\"mb-3\">\n        <label for=\"date-").concat(appointmentId, "\" class=\"form-label\">Terminoptionen</label>\n        <div id=\"date-").concat(appointmentId, "\">");
    for (var _b = 0, _c = details.selectable_dates; _b < _c.length; _b++) {
        var selectableDate = _c[_b];
        output += "\n            <div class=\"form-check\">\n                <input class=\"form-check-input date-checkbox-".concat(appointmentId, "\" type=\"checkbox\" value=\"").concat(selectableDate.date, " ").concat(selectableDate.time, "\" id=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\" name=\"date\" data-date=\"").concat(selectableDate.date, "\" data-time=\"").concat(selectableDate.time, "\" ").concat(isExpired ? 'disabled' : '', ">\n                <label class=\"form-check-label\" for=\"selectableDate-").concat(appointmentId, "-").concat(selectableDate.date, "-").concat(selectableDate.time, "\">\n                    ").concat(selectableDate.date, ", ").concat(selectableDate.time, " Uhr\n                </label>\n            </div>");
    }
    output += "</div>";
    output += "\n        </select>\n        </div>\n        <div class=\"mb-3\">\n            <label for=\"comment-".concat(appointmentId, "\" class=\"form-label\">Kommentare</label>\n            <textarea class=\"form-control\" id=\"comment-").concat(appointmentId, "\" name=\"comment\" rows=\"3\" placeholder=\"optional\" ").concat(isExpired ? 'disabled' : '', "></textarea>\n        </div>");
    output += "</form>";
    if (isExpired) {
        output += "<div class=\"alert alert-warning\" role=\"alert\">Dieser Termin ist abgelaufen. Abstimmung nicht mehr m\u00F6glich.</div>";
    }
    else {
        output += "<button type=\"button\" id=\"submit-vote-".concat(appointmentId, "\" class=\"btn btn-primary\" disabled>Abstimmen</button>");
    }
    output += "     </div></div><div>\n    </div></form>";
    output += '</ul><br/>';
    output += "\n            <h4 class\"card-title\">Kommentare</h4>\n<ul class=\"list-group\">\n";
    var uniqueUsernames = {};
    for (var _d = 0, _e = details.user_votes; _d < _e.length; _d++) {
        var userVote = _e[_d];
        var hasComment = userVote.comment.trim() !== '';
        if (hasComment && !uniqueUsernames[userVote.username]) {
            uniqueUsernames[userVote.username] = true;
            output += "\n        <li class=\"list-group-item\">\n            <strong>".concat(userVote.username, ":</strong>\n            <br>\n            <span class=\"user-comment\">").concat(userVote.comment, "</span>\n        </li>\n        ");
        }
    }
    $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"] .appointment-details")).html(output);
    $("#submit-vote-".concat(appointmentId)).on('click', function () {
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
    // Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons hinzufügen
    $("#username-".concat(appointmentId)).on('input', function () {
        if ($(this).val() && !isExpired) {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', false);
        }
        else {
            $("#submit-vote-".concat(appointmentId)).prop('disabled', true);
        }
    });
}
function submitVote(appointmentId, username, comment, selectedDates, callback) {
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
function submitNewAppointment(event) {
    event.preventDefault();
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
        },
        error: function (xhr, status, error) {
            console.error("Error:", error, "Status:", status, "xhr:", xhr);
            console.log("Raw response:", xhr.responseText);
            alert("Fehler beim Speichern des Termins. Bitte versuchen Sie es erneut.");
        },
    });
}
function parseGermanDate(dateString) {
    var _a = dateString.split('.'), day = _a[0], month = _a[1], year = _a[2];
    return new Date(year, month - 1, day);
}
function parseDate(dateString) {
    var _a = dateString.split('.'), day = _a[0], month = _a[1], year = _a[2];
    return "".concat(year, "-").concat(month, "-").concat(day);
}
function deleteAppointment(appointmentId) {
    var data = {
        method: 'deleteAppointment',
        param: appointmentId
    };
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                // Entferne den gelöschten Termin aus der Liste
                $(".appointment-row[data-appointment-id=\"".concat(appointmentId, "\"]")).remove();
                $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]")).remove();
                alert('Termin erfolgreich gelöscht.');
            }
            else {
                alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
        }
    });
}
