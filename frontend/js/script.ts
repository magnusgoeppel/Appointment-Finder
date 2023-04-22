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

    // Konvertiere das Array von Arrays in ein flaches Array
    const flatAppointments: any[] = [].concat(appointments);

    let output = `<table class="table table-striped">
            <thead>
                <tr>
                    <th>Details</th>
                    <th>ID</th>
                    <th>Titel</th>
                    <th>Ort</th>
                    <th>Ablaufdatum des Votings</th>
                    <th>Status</th>
                </tr>
            </thead>
    <tbody>`;
    for (const appointment of flatAppointments)
    {
        function parseGermanDate(dateString)
        {
            const [day, month, year] = dateString.split('.');
            return new Date(year, month - 1, day);
        }

        let status = "Offen";
        const currentDate = new Date();
        const expiryDate = parseGermanDate(appointment.expiry_date);
        console.log(currentDate, expiryDate);

        if (currentDate > expiryDate)
        {
            status = "Abgelaufen";
        }
        output += `
            <tr class="appointment-row" data-appointment-id="${appointment.id}">
                <td><img class="toggle-details" data-appointment-id="${appointment.id}" src="img/expand.png" alt="Toggle details"></td>
                <td>${appointment.id}</td>
                <td>${appointment.title}</td>
                <td>${appointment.location}</td>
                <td>${appointment.expiry_date}</td>
                <td>${status}</td>
            </tr>
            <tr class="details-row" data-appointment-id="${appointment.id}" style="display: none;">
                <td colspan="7">
                    <div class="appointment-details"></div>
                </td>
            </tr>
        `;
    }

    output += "</tbody>" +
                "</table>";
    $(".appointments-list").html(output);

    // Event Listener zum Klicken auf das Bild hinzufügen
    $('.toggle-details').click(function () {
        const appointmentId = $(this).data('appointment-id');
        const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);

        if (detailsRow.is(':visible'))
        {
            detailsRow.hide();
            $(this).attr('src', 'img/expand.png'); // Ändere das Bild zu "expand.png", wenn die Detailansicht geschlossen ist
        }
        else
        {
            detailsRow.show();
            $(this).attr('src', 'img/collapse.png'); // Ändere das Bild zu "collapse.png", wenn die Detailansicht geöffnet ist
            loadAppointmentDetails(appointmentId);
        }
    });
}

function loadAppointmentDetails(appointmentId)
{
    const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);
    const status = detailsRow.prev('.appointment-row').find('td:last-child').text();


    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: { method: 'queryAppointmentDetails', param: appointmentId },
        dataType: 'json',
        success: function (data)
        {
            updateAppointmentDetails(appointmentId, data, status);
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

function updateAppointmentDetails(appointmentId, details, status)
{
    let output = `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Voting</h4>
                <ul class="list-group">
    `;

    for (const selectableDate of details.selectable_dates)
    {

        output += `
            <li class="list-group-item">
                ${selectableDate.date}    
                ${selectableDate.time}
                <span class="badge bg-primary rounded-pill">${selectableDate.votes} Stimmen</span>
            </li>
        `;
    }
    output += `</ul>`;

    output += `

    <form class="appointment-form" data-appointment-id="${appointmentId}">
        <h4 class="card-title mt-3">Abstimmen</h4>
        <div class="card">
            <div class="card-body">
        <div class="mb-3">
            <label for="username-${appointmentId}" class="form-label">Name</label>
            <input type="text" class="form-control" id="username-${appointmentId}" name="username" required>
        </div>
        <!--TO-DO Checkboxes für die Termine-->
        <div class="mb-3">
            <label for="date-${appointmentId}" class="form-label">Terminoptionen</label>
            <select class="form-control" id="date-${appointmentId}" name="date" required>`;

    for (const selectableDate of details.selectable_dates)
    {
        output += `<option value="${selectableDate.date} ${selectableDate.time}" data-date="${selectableDate.date}" data-time="${selectableDate.time}">${selectableDate.date}, ${selectableDate.time} Uhr</option>`;
    }

    output += `
            </select>
        </div>
        <div class="mb-3">
            <label for="comment-${appointmentId}" class="form-label">Kommentar</label>
            <textarea class="form-control" id="comment-${appointmentId}" name="comment" rows="3" placeholder="optional"></textarea>
        </div>`;

    output += `</form>`;

    if (status === "Abgelaufen")
    {
        output += `<div class="alert alert-warning" role="alert">Dieser Termin ist abgelaufen. Abstimmung nicht mehr möglich.</div>`;
    } else {
        output += `<button type="submit" id="submit-vote-${appointmentId}" class="btn btn-primary" disabled>Abstimmen</button>`;
    }

    output += `     </div></div><div>
        </div></form>`;

    output += '</ul><br/>';

    output += `
                <h4 class="card-title">Bisherige Abstimmungen und Kommentare</h4>
                <ul class="list-group">
    `;

    for (const userVote of details.user_votes)
    {
        const hasComment = userVote.comment.trim() !== '';

        output += `
    <li class="list-group-item">
        <strong>${userVote.username}${hasComment ? ' :' : ''}</strong> <span class="user-comment">${userVote.comment}</span>
        <br>
        <small>Gewähltes Datum: ${userVote.selected_date}, ${userVote.selected_time} Uhr</small>
    </li>
`;
    }

    $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).html(output);


    // Event Listener zum Absenden des Formulars hinzufügen
    $(`#submit-vote-${appointmentId}`).click(function (event) {
        event.preventDefault();

        console.log('Formular abgeschickt');

        const username = $(`#username-${appointmentId}`).val();
        const selectedOption = $(`#date-${appointmentId} option:selected`);
        const selectedDate = selectedOption.data('date');
        const selectedTime = selectedOption.data('time');
        const comment = $(`#comment-${appointmentId}`).val();
        console.log (username, selectedDate, selectedTime, comment);

        submitVote(appointmentId, username, selectedDate, selectedTime, comment);
    });

    // Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons hinzufügen
    $(`#username-${appointmentId}`).on('input', function () {
        if ($(this).val()) {
            $(`#submit-vote-${appointmentId}`).prop('disabled', false);
        } else {
            $(`#submit-vote-${appointmentId}`).prop('disabled', true);
        }
    });

}

function submitVote(appointmentId, username, selectedDate, selectedTime, comment)
{
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'POST',
        data: {
            method: 'submitVote',
            param: {
                appointmentId: appointmentId,
                username: username,
                selectedDaten: selectedDate,
                selectedTime: selectedTime,
                comment: comment
            }
        },
        dataType: 'json',
        success: function (data)
        {
            console.log(data)

            if (data.success)
            {
                console.log(data.success);
                // Zeige Erfolgsmeldung an
                let html = '<div class="alert alert-success" role="alert">';
                html += 'Ihre Abstimmung wurde erfolgreich gespeichert.';
                html += '</div>';
                $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).prepend(html);

                // Aktualisiere die Detailansicht
                loadAppointmentDetails(appointmentId);
            }
            else
            {
                // Zeige Fehlermeldung an
                let html = '<div class="alert alert-danger" role="alert">';
                html += 'Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es später erneut.';
                html += '</div>';
                $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).prepend(html);
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            let html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).prepend(html);
        }
    });
}

