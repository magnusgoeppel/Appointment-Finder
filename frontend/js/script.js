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
            console.error('Error: ' + textStatus, errorThrown);
            var html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}
function displayAppointments(appointments) {
    var html = '<table class="table table-striped">';
    html += '<thead><tr><th>Titel</th><th>Ort</th><th>Datum</th><th>Ablaufdatum des Votings</th><th>Status</th></tr></thead>';
    html += '<tbody>';
    appointments.forEach(function (appointment) {
        html += '<tr>';
        html += "<td>".concat(appointment.title, "</td>");
        html += "<td>".concat(appointment.location, "</td>");
        html += "<td>".concat(appointment.date, "</td>");
        html += "<td>".concat(appointment.expirationDate, "</td>");
        html += "<td>".concat(appointment.status, "</td>");
        html += '</tr>';
    });
    html += '</tbody></table>';
    $('.appointments-list').html(html);
}
