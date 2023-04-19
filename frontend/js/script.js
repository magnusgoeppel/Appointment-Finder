document.addEventListener("DOMContentLoaded", function () {
    fetchAppointments();
});
function fetchAppointments() {
    fetch("backend/serviceHandler.php?method=queryAppointments")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var appointmentsList = document.querySelector(".appointments-list");
        data.forEach(function (appointment) {
            var expiredClass = new Date(appointment.expiry_date) < new Date() ? "text-danger" : "";
            var appointmentElement = "\n                <div class=\"card ".concat(expiredClass, " mb-3\">\n                    <div class=\"card-body\">\n                        <h5 class=\"card-title\">").concat(appointment.title, "</h5>\n                        <h6 class=\"card-subtitle mb-2\">").concat(appointment.location, "</h6>\n                        <p class=\"card-text\">Date: ").concat(appointment.date, "</p>\n                        <p class=\"card-text\">Expiry Date: ").concat(appointment.expiry_date, "</p>\n                    </div>\n                </div>\n                ");
            appointmentsList.insertAdjacentHTML('beforeend', appointmentElement);
        });
    });
}
