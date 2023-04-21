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
    console.log(appointments);
    // Konvertiere das Array von Arrays in ein flaches Array
    var flatAppointments = [].concat.apply([], appointments);
    var output = "\n        <table class=\"table table-striped\">\n            <thead>\n                <tr>\n                    <th>ID</th>\n                    <th>Titel</th>\n                    <th>Ort</th>\n                    <th>Datum</th>\n                    <th>Ablaufdatum des Votings</th>\n                    <th>Status</th>\n                </tr>\n            </thead>\n            <tbody>\n    ";
    for (var _i = 0, flatAppointments_1 = flatAppointments; _i < flatAppointments_1.length; _i++) {
        var appointment = flatAppointments_1[_i];
        var status_1 = "Offen";
        var currentDate = new Date();
        var expiryDate = new Date(appointment.expiry_date);
        if (currentDate > expiryDate) {
            status_1 = "Abgelaufen";
        }
        output += "\n            <tr>\n                <td>".concat(appointment.id, "</td>\n                <td>").concat(appointment.title, "</td>\n                <td>").concat(appointment.location, "</td>\n                <td>").concat(appointment.date, "</td>\n                <td>").concat(appointment.expiry_date, "</td>\n                <td>").concat(status_1, "</td>\n            </tr>\n        ");
    }
    output += "</tbody></table>";
    $(".appointments-list").html(output);
}
/*function displayAppointments(appointments)
{
    console.log(appointments);

    let output = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Titel</th>
                    <th>Ort</th>
                    <th>Datum</th>
                    <th>Ablaufdatum des Votings</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const appointmentGroup of appointments)
    {
        for (const appointment of appointmentGroup)
        {
            let status = "Offen";
            const currentDate = new Date();
            const expiryDate = new Date(appointment.expiry_date);

            if (currentDate > expiryDate)
            {
                status = "Abgelaufen";
            }

            output += `
                <tr>
                    <td>${appointment.title}</td>
                    <td>${appointment.location}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.expiry_date}</td>
                    <td>${status}</td>
                </tr>
            `;
        }
    }
    output += "</tbody></table>";
    $(".appointments-list").html(output);
}
*/
