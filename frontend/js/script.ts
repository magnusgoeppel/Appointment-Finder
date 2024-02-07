$(document).ready(function ()
{
    // Lade die Termine
    loadAppointments();
    // Event Listener für den newAppointment-Button hinzufügen
    $("#title, #location, #description, #duration, #selectable_dates, #expiry_date").on("input", updateSubmitButtonState);
    document.getElementById("new-appointment-btn").addEventListener("click", submitNewAppointment);
});

// Lade die Termine
function loadAppointments()
{
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: {method: 'queryAppointments'},
        dataType: 'json',
        success: function (data)
        {
            // Anzeigen der Appointments
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

// Anzeigen der Appointments
function displayAppointments(appointments)
{
    let output = `<table class="table table-striped">
            <thead>
                <tr>
                    <th>Details</th>
                    <th>Titel</th>
                    <th>Ort</th>
                    <th class="shift-left">Ablaufdatum des Votings</th>
                    <th>Status</th>
                    <th class="shift-left_light">Löschen</th>
                </tr>
            </thead>
    <tbody>`;

    for (const appointment of appointments)
    {
        let status = "Offen";
        const currentDate = new Date();
        const expiryDate = parseGermanDate(appointment.expiry_date);
        console.log(currentDate);
        console.log(expiryDate);


        if (currentDate > expiryDate)
        {
            status = "Abgelaufen";
        }
        output += `
            <tr class="appointment-row" data-appointment-id="${appointment.id}">
                <td><img class="toggle-details" data-appointment-id="${appointment.id}" src="img/expand.png" alt="Toggle details"></td>
                <td>${appointment.title}</td>
                <td>${appointment.location}</td>
                <td>${appointment.expiry_date}</td>
                <td>${status}</td>
                <td><img class="deletePic" id="${appointment.id}" src="img/delete.png"></td>
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

    // Event Listener zum Klicken auf die Details
    $('.toggle-details').click(function ()
    {
        const appointmentId = $(this).data('appointment-id');
        const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);

        if (detailsRow.is(':visible'))
        {
            // Verstecke die Detailansicht
            detailsRow.hide();
            $(this).attr('src', 'img/expand.png'); // Ändere das Bild zu "expand.png", wenn die Detailansicht geschlossen ist
        }
        else
        {
            // Zeige die Detailansicht an
            detailsRow.show();
            // Ändere das Bild zu "collapse.png", wenn die Detailansicht geöffnet ist
            $(this).attr('src', 'img/collapse.png');
            loadAppointmentDetails(appointmentId);

        }
    });

    // Event Listener zum Klicken auf das Löschen eines Termins
    $('.deletePic').click(function ()
    {
        const deleteAppointmentId = this.id;
        console.log(deleteAppointmentId);
        deleteAppointment(deleteAppointmentId);
    });
}

// Löschen eines Termins
function loadAppointmentDetails(appointmentId)
{
    const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);
    const status = detailsRow.prev('.appointment-row').find('td:nth-last-child(2)').text();

    console.log()

    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: {method: 'queryAppointmentDetails', param: appointmentId},
        dataType: 'json',
        success: function (data)
        {
            console.log(data);
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

// Aktualisiert den "Submit" Button-Zustand basierend auf der Vollständigkeit des Formulars
function updateSubmitButtonState()
{
    const allFieldsFilled = checkFormNewAppointment();
    $("#new-appointment-btn").prop("disabled", !allFieldsFilled);
}

// Überprüfe, ob alle Felder ausgefüllt sind
function checkFormNewAppointment()
{
    const title = $("#title").val();
    const location = $("#location").val();
    const description = $("#description").val();
    const duration = $("#duration").val();
    const selectable_dates = $("#selectable_dates").val();
    const expiry_date = $("#expiry_date").val();

    // Überprüfen Sie, ob alle Felder ausgefüllt sind, und geben Sie true oder false zurück
    return title && location && description && duration && selectable_dates && expiry_date;
}

// Anzeigen der Details eines Termins
function updateAppointmentDetails(appointmentId, details, status)
{
    let output = '';

    // Beschreibung
    output += `<div class="card"> <div class="card-body">
     <form class="description-form">
                <h4 class="card-title">Beschreibung</h4>
                    <ul class="list-group">
                        <li class="list-group-item">       
                            <span>${details.description}</span>
                        </li>
                    </ul>
                </form>
               
       <!-- Dauer -->
        <form class="duration-form">      
            <h4 class="card-title mt-3">Dauer</h4>       
            <ul class="list-group">\n            
                <li class="list-group-item">
                    <span>${details.duration} Minuten</span>
                </li>
            </ul>
        </form>`;
    // Voting
    output += '<h4 class="card-title mt-3">Voting</h4> <ul class="list-group"> ';

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

    // Abstimmung
    output += `<form class="appointment-form" data-appointment-id="${appointmentId}">
                <h4 class="card-title mt-3">Abstimmen</h4>
                <div class="card">
                    <div class="card-body">
                <div class="mb-3">
                    <label for="username-${appointmentId}" class="form-label">Name</label>
                    <input type="text" class="form-control" id="username-${appointmentId}" name="username" required>
                </div>
   
    <div class="mb-3">
        <label for="date-${appointmentId}" class="form-label">Terminoptionen</label>
        <div id="date-${appointmentId}">`;

    for (const selectableDate of details.selectable_dates)
    {
        output += `
            <div class="form-check">
                <input class="form-check-input date-checkbox-${appointmentId}" type="checkbox" value="${selectableDate.date} ${selectableDate.time}" id="selectableDate-${appointmentId}-${selectableDate.date}-${selectableDate.time}" name="date" data-date="${selectableDate.date}" data-time="${selectableDate.time}">
                <label class="form-check-label" for="selectableDate-${appointmentId}-${selectableDate.date}-${selectableDate.time}">
                    ${selectableDate.date}, ${selectableDate.time} Uhr
                </label>
            </div>`;
    }

    output += `</div>`;

    output += `
        </select>
        </div>
        <div class="mb-3">
            <label for="comment-${appointmentId}" class="form-label">Kommentare</label>
            <textarea class="form-control" id="comment-${appointmentId}" name="comment" rows="3" placeholder="optional"></textarea>
        </div>`;

    output += `</form>`;

    // Wenn der Termin noch nicht abgelaufen ist, kann abgestimmt werden
    if (status === "Abgelaufen")
    {
        output += `<div class="alert alert-warning" role="alert">Dieser Termin ist abgelaufen. Abstimmung nicht mehr möglich.</div>`;
    } else
    {
        output += `<button type="button" id="submit-vote-${appointmentId}" class="btn btn-primary" disabled>Abstimmen</button>`;
    }

    output += `     </div></div><div>
    </div></form>`;

    output += '</ul><br/>';

    output += `
            <h4 class"card-title">Kommentare</h4>
            <ul class="list-group">`;

    const uniqueUsernames = {};

    // Generieren der Liste der Kommentare
    for (const userVote of details.user_votes)
    {
        const hasComment = userVote.comment.trim() !== '';

        if (hasComment && !uniqueUsernames[userVote.username])
        {
            uniqueUsernames[userVote.username] = true;
            output += `
        <li class="list-group-item">
            <strong>${userVote.username}:</strong>
            <br>
            <span class="user-comment">${userVote.comment}</span>
        </li>
        `;
        }
    }
    output += `</ul>`;

    // Anzeigen der Details
    $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).html(output);

    // Die Funktion checkVoteButtonStatus wird aufgerufen, um den Abstimm-Button zu aktivieren/deaktivieren
    function checkVoteButtonStatus()
    {
        const anyCheckboxChecked = $(`.date-checkbox-${appointmentId}:checked`).length > 0;
        const usernameNotEmpty = $(`#username-${appointmentId}`).val() !== '';

        if (usernameNotEmpty && anyCheckboxChecked)
        {
            $(`#submit-vote-${appointmentId}`).prop('disabled', false);
        } else {
            $(`#submit-vote-${appointmentId}`).prop('disabled', true);
        }
    }

    $(`#username-${appointmentId}`).on('input', checkVoteButtonStatus);

    // Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons
    $(`.date-checkbox-${appointmentId}`).on('change', checkVoteButtonStatus);

    // Event Listener zum Absenden des Abstimm-Formulars
    $(`#submit-vote-${appointmentId}`).on('click', function ()
    {
        console.log("submit vote");
        let username = $(`#username-${appointmentId}`).val();
        let comment = $(`#comment-${appointmentId}`).val();
        let selectedDates = [];

        $(`.date-checkbox-${appointmentId}:checked`).each(function ()
        {
            let date = $(this).data('date');
            let parsedDate = parseDate(date);
            let time = $(this).data('time');
            selectedDates.push({ date: parsedDate, time: time });

        });

        submitVote(appointmentId, username, comment, selectedDates, function ()
        {
            loadAppointmentDetails(appointmentId);
        });
    });

}

// Funktion zum Speichern der Abstimmung
function submitVote(appointmentId, username, comment, selectedDates, callback)
{
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
        success: function (response)
        {
            if (callback)
            {
                callback();
            }
            console.log('Ihre Abstimmung wurde erfolgreich gespeichert!');
            console.log(response);
            alert('Ihre Abstimmung wurde erfolgreich gespeichert!');
        },
        error: function ()
        {
            console.error('Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es erneut.');
            alert('Fehler beim Speichern Ihrer Abstimmung. Bitte versuchen Sie es erneut.');
        }
    });
}

// Funktion zum Speichern eines neuen Termins
function submitNewAppointment(event)
{
    event.preventDefault();

    // Funktion zum Konvertieren des Datums in das richtige Format
    function convertDateTimeFormat(dateTimeString)
    {
        const [datePart, timePart] = dateTimeString.split(', ');
        const [day, month, year] = datePart.split('.');
        const [time, uhr] = timePart.split(' ');
        return `${year}-${month}-${day}, ${time}.00 ${uhr}`;
    }

    const title = $("#title").val();
    const location = $("#location").val();
    const description = $("#description").val();
    const duration = $("#duration").val();
    const selectable_dates_unformed = $("#selectable_dates").val();
    const selectable_dates = typeof selectable_dates_unformed === 'string' ? selectable_dates_unformed.split('\n').map
                                          (dateTimeString => convertDateTimeFormat(dateTimeString)).join('\n') : '';
    const expiry_date = parseDate($("#expiry_date").val());


    const data =
    {
        method: "createNewAppointment",
        param:
        {
            title,
            location,
            description,
            duration,
            selectable_dates,
            expiry_date,

        },
    };
    console.log(data);

    $.ajax({
        url: "../../backend/serviceHandler.php",
        type: "GET",
        data: data,
        dataType: "json",
        success: function (result)
        {
            console.log(result);
            alert("Neues Appointment erfolgreich erstellt!");
            window.location.reload();
        },
        error: function (xhr, status, error)
        {
            console.error("Error:", error , "Status:", status, "xhr:", xhr);
            console.log("Raw response:", xhr.responseText);
            alert("Fehler beim Speichern des Appointments. Bitte versuchen Sie es erneut.");
        },
    });
}

// Funktion zum Formatieren des Datums
function parseGermanDate(dateString)
{
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
}

// Funktion zum Formatieren des Datums
function parseDate(dateString)
{
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
}

// Funktion zum Löschen eines Termins
function deleteAppointment(appointmentId)
{
    const data=
        {
            method: 'deleteAppointment',
            param: {appointmentId}
        }
        console.log(data);

    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: data,

        dataType: 'json',
        success: function ()
        {
            alert('Termin erfolgreich gelöscht.');
            location.reload();

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            console.log('Raw response:', jqXHR.responseText);
            alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
        }
    });
}
