document.addEventListener("DOMContentLoaded", function () {
    fetchAppointments();
});

interface Appointment
{
    title: string;
    location: string;
    date: string;
    expiry_date: string;
}

function fetchAppointments(): void {
    fetch("backend/serviceHandler.php?method=queryAppointments")
        .then(response => response.json())
        .then((data: Appointment[]) => {
            let appointmentsList = document.querySelector(".appointments-list");

            data.forEach(function (appointment: Appointment) {
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

                appointmentsList.insertAdjacentHTML('beforeend', appointmentElement);
            });
        });
}
