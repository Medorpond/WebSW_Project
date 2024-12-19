document.addEventListener("DOMContentLoaded", function() {
    const calendar = flatpickr("#calendar", {
        inline: true,
        static: true,
        defaultDate: new Date(),
        onMonthChange: function(selectedDates, dateStr, instance) {
            const date = selectedDates[0];
            fetchReservations(date.getFullYear(), date.getMonth() + 1);
        },
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            const date = dayElem.dateObj;
            const dateStr = date.toISOString().split('T')[0];

            const container = document.createElement('div');
            container.className = 'reservations-container';
            dayElem.appendChild(container);
        }
    });

    function fetchReservations(year, month) {
        fetch(`get_reservations.php?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateCalendar(data.data);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function updateCalendar(reservations) {
        const days = document.querySelectorAll('.flatpickr-day');
        days.forEach(day => {
            const container = day.querySelector('.reservations-container');
            container.innerHTML = '';

            const dateStr = day.getAttribute('aria-label');
            const dayReservations = reservations.filter(r =>
                new Date(r.time).toLocaleDateString() === new Date(dateStr).toLocaleDateString()
            );

            dayReservations.forEach(reservation => {
                const item = document.createElement('div');
                item.className = 'reservation-item';
                const time = new Date(reservation.time).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                item.textContent = `${time} - ${reservation.name}`;
                container.appendChild(item);
            });
        });
    }

    // 초기 데이터 로드
    const now = new Date();
    fetchReservations(now.getFullYear(), now.getMonth() + 1);
});
