document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const confirmButton = document.getElementById('confirmAppointment');
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentInfo = document.getElementById('appointmentInfo');
    const nameInfo = document.getElementById('nameInfo');
    const timeInfo = document.getElementById('timeInfo');
    const backButton = document.getElementById('backButton');
    const cancelButton = document.getElementById('cancelButton');

    function validateInputs() {
        const nameValid = nameInput.value.trim() !== '';
        const phoneValid = /^\d{11}$/.test(phoneInput.value.trim());
        confirmButton.disabled = !(nameValid && phoneValid);
    }

    nameInput.addEventListener('input', validateInputs);
    phoneInput.addEventListener('input', validateInputs);

    confirmButton.addEventListener('click', function() {
        // Simulating POST request to PHP
        fetch('/BackEnd/php/updateReservation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput.value.trim(),
                contact: phoneInput.value.trim(),
                action: 'view'
            })
        })
            .then(response => response.json())
            .then(data => {
                nameInfo.textContent = `${data.name}님`;
                timeInfo.textContent = `${data.time}`;
                appointmentForm.style.display = 'none';
                appointmentInfo.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    });

    backButton.addEventListener('click', function() {
        appointmentForm.style.display = 'block';
        appointmentInfo.style.display = 'none';
    });

    cancelButton.addEventListener('click', function() {
        if (confirm('예약을 취소하시겠습니까?\n\n' + nameInfo.textContent + '\n' + timeInfo.textContent)) {
            // Simulating POST request to cancel appointment
            fetch('/BackEnd/php/updateReservation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    contact: phoneInput.value.trim(),
                    action: 'cancel'
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('[예약 취소]\n예약이 취소되었습니다.\n진료 예약을 통해 다시 예약하실 수 있습니다.');
                        appointmentForm.style.display = 'block';
                        appointmentInfo.style.display = 'none';
                        nameInput.value = '';
                        phoneInput.value = '';
                        validateInputs();
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
