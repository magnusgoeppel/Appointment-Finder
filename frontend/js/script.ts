$(document).ready(function ()
{
    loadAppointments();
});

function loadAppointments()
{
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointments' },
        dataType: 'json',
        success: function (data)
        {
            displayAppointments(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + textStatus, errorThrown);
            let html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}

function displayAppointments(appointments: any[]) {
    let html = '<table class="table table-striped">';
    html += '<thead><tr><th>Titel</th><th>Ort</th><th>Datum</th><th>Ablaufdatum des Votings</th><th>Status</th></tr></thead>';
    html += '<tbody>';

    appointments.forEach(appointment => {
        html += '<tr>';
        html += `<td>${appointment.title}</td>`;
        html += `<td>${appointment.location}</td>`;
        html += `<td>${appointment.date}</td>`;
        html += `<td>${appointment.expirationDate}</td>`;
        html += `<td>${appointment.status}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    $('.appointments-list').html(html);
}
