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
    var output = "\n        <table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>Details</th>\n                    <th>ID</th>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th>Datum</th>\n                    <th>Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                </tr>\n            </thead>\n            <tbody>\n    ";
    for (var _i = 0, flatAppointments_1 = flatAppointments; _i < flatAppointments_1.length; _i++) {
        var appointment = flatAppointments_1[_i];
        var status_1 = "Offen";
        var currentDate = new Date();
        var expiryDate = new Date(appointment.expiry_date);
        if (currentDate > expiryDate) {
            status_1 = "Abgelaufen";
        }
        output += "<tr class=\"appointment-row\" data-appointment-id=\"".concat(appointment.id, "\">\n                      <td><button class=\"btn btn-primary toggle-details-btn\" data-appointment-id=\"").concat(appointment.id, "\">Details</button></td>\n                      <td>").concat(appointment.id, "</td>\n                      <td>").concat(appointment.title, "</td>\n                      <td>").concat(appointment.location, "</td>\n                      <td>").concat(appointment.date, "</td>\n                      <td>").concat(appointment.expiry_date, "</td>\n                      <td>").concat(status_1, "</td>\n                  </tr>\n                  \n                  <tr class=\"details-row\" data-appointment-id=\"").concat(appointment.id, "\" style=\"display: none;\">\n                      <td colspan=\"6\">\n                          <div class=\"appointment-details\"></div>\n                      </td>\n                  </tr>");
    }
    output += "</tbody></table>";
    $(".appointments-list").html(output);
    $('.toggle-details-btn').click(function (e) {
        e.stopPropagation(); // Verhindert das Auslösen des Klick-Events auf die Tabellenzeile
        var appointmentId = $(this).data('appointment-id');
        var detailsRow = $(".details-row[data-appointment-id=\"".concat(appointmentId, "\"]"));
        //const detailsDiv = detailsRow.find('.appointment-details');
        if (detailsRow.is(':visible')) {
            detailsRow.hide();
        }
        else {
            detailsRow.show();
            loadAppointmentDetails(appointmentId);
        }
    });
}
function loadAppointmentDetails(appointmentId) {
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointmentDetails', param: appointmentId },
        dataType: 'json',
        success: function (data) {
            updateAppointmentDetails(appointmentId, data);
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
function updateAppointmentDetails(appointmentId, details) {
    var output = "\n        <h4>Terminoptionen</h4>\n        <ul class=\"list-group\">\n    ";
    for (var _i = 0, _a = details.selectable_dates; _i < _a.length; _i++) {
        var selectableDate = _a[_i];
        output += "\n            <li class=\"list-group-item\">\n                ".concat(selectableDate.date, "\n                <span class=\"badge bg-primary rounded-pill\">").concat(selectableDate.votes, " Stimmen</span>\n            </li>\n        ");
    }
    output += '</ul><br/>';
    output += "\n        <h4>Bisherige Abstimmungen und Kommentare</h4>\n        <ul class=\"list-group\">\n    ";
    for (var _b = 0, _c = details.user_votes; _b < _c.length; _b++) {
        var userVote = _c[_b];
        output += "\n            <li class=\"list-group-item\">\n                <strong>".concat(userVote.username, ":</strong> ").concat(userVote.comment, "\n                <br>\n                <small>Gew\u00E4hltes Datum: ").concat(userVote.selected_date, "</small>\n            </li>\n        ");
    }
    output += '</ul>';
    $("#details-".concat(appointmentId, " .details-container")).html(output);
}
