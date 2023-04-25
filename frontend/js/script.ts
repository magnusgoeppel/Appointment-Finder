$(document).ready(function ()
{
    loadAppointments();
    //checkFormNewAppointment();
    document.getElementById("new-appointment-btn").addEventListener("click", submitNewAppointment);
});

function loadAppointments()
{
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: {method: 'queryAppointments'},
        dataType: 'json',
        success: function (data)
        {
            displayAppointments(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            let html = '<div class="alert alert-danger" role="alert">';
            html += 'Fehler beim Laden der Termine. Bitte versuchen Sie es später erneut.';
            html += '</div>';
            $('.appointments-list').html(html);
        }
    });
}

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

    $('.deletePic').click(function ()
    {
        const deleteAppointmentId = this.id;
        console.log(deleteAppointmentId);
        deleteAppointment(deleteAppointmentId);
    });
}

function loadAppointmentDetails(appointmentId)
{
    const detailsRow = $(`.details-row[data-appointment-id="${appointmentId}"]`);
    const status = detailsRow.prev('.appointment-row').find('td:last-child').text();

    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: {method: 'queryAppointmentDetails', param: appointmentId},
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

function updateAppointmentDetails(appointmentId, details, status)
{
    let isExpired = status === "Abgelaufen";
    let output = '<div class="card"> <div class="card-body"> <h4 class="card-title">Voting</h4> <ul class="list-group"> ';

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
            <input type="text" class="form-control" id="username-${appointmentId}" name="username" required ${isExpired ? 'disabled' : ''}>
        </div>
   
    <div class="mb-3">
        <label for="date-${appointmentId}" class="form-label">Terminoptionen</label>
        <div id="date-${appointmentId}">`;
    for (const selectableDate of details.selectable_dates)
    {
        output += `
            <div class="form-check">
                <input class="form-check-input date-checkbox-${appointmentId}" type="checkbox" value="${selectableDate.date} ${selectableDate.time}" id="selectableDate-${appointmentId}-${selectableDate.date}-${selectableDate.time}" name="date" data-date="${selectableDate.date}" data-time="${selectableDate.time}" ${isExpired ? 'disabled' : ''}>
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
            <textarea class="form-control" id="comment-${appointmentId}" name="comment" rows="3" placeholder="optional" ${isExpired ? 'disabled' : ''}></textarea>
        </div>`;

    output += `</form>`;

    if (isExpired) {
        output += `<div class="alert alert-warning" role="alert">Dieser Termin ist abgelaufen. Abstimmung nicht mehr möglich.</div>`;
    } else {
        output += `<button type="button" id="submit-vote-${appointmentId}" class="btn btn-primary" disabled>Abstimmen</button>`;
    }

    output += `     </div></div><div>
    </div></form>`;

    output += '</ul><br/>';

    output += `
            <h4 class"card-title">Kommentare</h4>
<ul class="list-group">
`;

    const uniqueUsernames = {};

    for (const userVote of details.user_votes) {
        const hasComment = userVote.comment.trim() !== '';

        if (hasComment && !uniqueUsernames[userVote.username]) {
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



    $(`.details-row[data-appointment-id="${appointmentId}"] .appointment-details`).html(output);

    $(`#submit-vote-${appointmentId}`).on('click', function ()
    {

        let username = $(`#username-${appointmentId}`).val();
        let comment = $(`#comment-${appointmentId}`).val();
        let selectedDates = [];

        $(`.date-checkbox-${appointmentId}:checked`).each(function () {
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

// Event Listener zum Aktivieren/Deaktivieren des Abstimm-Buttons hinzufügen
    $(`#username-${appointmentId}`).on('input', function ()
    {
        if ($(this).val() && !isExpired)
        {
            $(`#submit-vote-${appointmentId}`).prop('disabled', false);
        }
        else
        {
            $(`#submit-vote-${appointmentId}`).prop('disabled', true);
        }
    });
}
    function submitVote(appointmentId, username, comment, selectedDates, callback)
{
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

function submitNewAppointment(event)
{
    event.preventDefault();

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
        },
        error: function (xhr, status, error)
        {
            console.error("Error:", error , "Status:", status, "xhr:", xhr);
            console.log("Raw response:", xhr.responseText);
            alert("Fehler beim Speichern des Termins. Bitte versuchen Sie es erneut.");
        },
    });
}


function parseGermanDate(dateString)
{
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
}


function parseDate(dateString)
{
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
}

function deleteAppointment(appointmentId)
{
    const data=
        {
            method: 'deleteAppointment',
            param: appointmentId
        }
    $.ajax({
        url: '../../backend/serviceHandler.php',
        method: 'GET',
        data: data,

        dataType: 'json',
        success: function (data)
        {
            if (data.success)
            {
                // Entferne den gelöschten Termin aus der Liste
                $(`.appointment-row[data-appointment-id="${appointmentId}"]`).remove();
                $(`.details-row[data-appointment-id="${appointmentId}"]`).remove();
                alert('Termin erfolgreich gelöscht.');
            }
            else
            {
                alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.error('Error: ' + jqXHR, textStatus, errorThrown);
            alert('Fehler beim Löschen des Termins. Bitte versuchen Sie es später erneut.');
        }
    });
}
