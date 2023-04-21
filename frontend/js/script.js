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
            //FEHLER
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}
function displayAppointments(appointments) {
    var output = "\n        <table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th>Datum</th>\n                    <th>Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                </tr>\n            </thead>\n            <tbody>\n    ";
    for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
        var appointmentGroup = appointments_1[_i];
        for (var _a = 0, appointmentGroup_1 = appointmentGroup; _a < appointmentGroup_1.length; _a++) {
            var appointment = appointmentGroup_1[_a];
            var status_1 = "Offen";
            var currentDate = new Date();
            var expiryDate = new Date(appointment.expiry_date);
            if (currentDate > expiryDate) {
                status_1 = "Abgelaufen";
            }
            output += "\n                <tr>\n                    <td>".concat(appointment.title, "</td>\n                    <td>").concat(appointment.location, "</td>\n                    <td>").concat(appointment.date, "</td>\n                    <td>").concat(appointment.expiry_date, "</td>\n                    <td>").concat(status_1, "</td>\n                </tr>\n            ");
        }
    }
    output += "</tbody></table>";
    $(".appointments-list").html(output);
}
