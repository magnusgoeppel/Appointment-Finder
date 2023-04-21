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
                    <th>Details</th>
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

    for (const appointment of flatAppointments)
    {
        let status = "Offen";
        const currentDate = new Date();
        const expiryDate = new Date(appointment.expiry_date);

        if (currentDate > expiryDate)
        {
            status = "Abgelaufen";
        }
        output += `<tr class="appointment-row" data-appointment-id="${appointment.id}">
                      <td><button class="btn btn-primary toggle-details-btn" data-appointment-id="${appointment.id}">Details</button></td>
                      <td>${appointment.id}</td>
                      <td>${appointment.title}</td>
                      <td>${appointment.location}</td>
                      <td>${appointment.date}</td>
                      <td>${appointment.expiry_date}</td>
                      <td>${status}</td>
                  </tr>
                  
                  <tr class="details-row" data-appointment-id="${appointment.id}" style="display: none;">
                      <td colspan="6">
                          <div class="appointment-details"></div>
                      </td>
                  </tr>`;
    }

    output += "</tbody></table>";
    $(".appointments-list").html(output);

    $('.toggle-details-btn').click(function (e)
    {
        e.stopPropagation(); // Verhindert das Auslösen des Klick-Events auf die Tabellenzeile
        const appointmentId = $(this).data('appointment-id');
        const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);
        //const detailsDiv = detailsRow.find('.appointment-details');

        if (detailsRow.is(':visible'))
        {
            detailsRow.hide();
        } else {
            detailsRow.show();
            loadAppointmentDetails(appointmentId);
        }
    });
}

function loadAppointmentDetails(appointmentId)
{
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointmentDetails', param: appointmentId },
        dataType: 'json',
        success: function (data)
        {
            updateAppointmentDetails(appointmentId, data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            let html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}

function updateAppointmentDetails(appointmentId, details)
{
    let output = `
        <h4>Terminoptionen</h4>
        <ul class="list-group">
    `;

    for (const selectableDate of details.selectable_dates)
    {
        output += `
            <li class="list-group-item">
                ${selectableDate.date}
                <span class="badge bg-primary rounded-pill">${selectableDate.votes} Stimmen</span>
            </li>
        `;
    }

    output += '</ul><br/>';

    output += `
        <h4>Bisherige Abstimmungen und Kommentare</h4>
        <ul class="list-group">
    `;

    for (const userVote of details.user_votes) {
        output += `
            <li class="list-group-item">
                <strong>${userVote.username}:</strong> ${userVote.comment}
                <br>
                <small>Gewähltes Datum: ${userVote.selected_date}</small>
            </li>
        `;
    }

    output += '</ul>';

    $(`#details-${appointmentId} .details-container`).html(output);
}

