$(document).ready(function ()
{
    fetchAppointments();
});

function fetchAppointments()
{

    $.getJSON("api.php?method=queryAppointments", function (data)
    {

        let appointmentsList = $(".appointments-list");

        data.forEach(function (appointment)
        {
            let expiredClass = new Date(appointment.expiry_date) < new Date() ? "text-danger" : "";
            let appointmentElement = `
            <div class="card ${expiredClass} mb-3">
                <div class="card-body">
                    <h5 class="card-title">${appointment.title}</h5>
                    <h6 class="card-subtitle mb-2">${appointment.location}</h6>
                    <p class="card-text">Date: ${appointment.date}</p>
                    <p class="card-text">Expiry Date: ${appointment.expiry_date}</p>
                </div>
            </div>
            `;
            appointmentsList.append(appointmentElement);
        });
    });
}