$(document).ready(function()
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
        error: function (jqXHR, textStatus, errorThrown)
        {
            //FEHLER
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            let html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}

function displayAppointments(appointments : any[])
{
    console.log(appointments);

    // Konvertiere das Array von Arrays in ein flaches Array
    const flatAppointments: any[] = [].concat(appointments);

    let output = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titel</th>
                    <th>Ort</th>
                    <th>Datum</th>
                    <th>Ablaufdatum des Votings</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const appointment of flatAppointments) {
        let status = "Offen";
        const currentDate = new Date();
        const expiryDate = new Date(appointment.expiry_date);

        if (currentDate > expiryDate) {
            status = "Abgelaufen";
        }

        output += `
            <tr>
                <td>${appointment.id}</td>
                <td>${appointment.title}</td>
                <td>${appointment.location}</td>
                <td>${appointment.date}</td>
                <td>${appointment.expiry_date}</td>
                <td>${status}</td>
            </tr>
        `;
    }
    output += "</tbody></table>";
    $(".appointments-list").html(output);
}

