// reservationOverview.js
document.addEventListener('DOMContentLoaded', () => {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentDateSpan = document.getElementById('currentDate');
    const calendarDiv = document.getElementById('calendar');

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        fetchAndRenderCalendar();
    }

    function fetchAndRenderCalendar() {
        fetch(`/BackEnd/php/get_reservations.php?year=${currentYear}&month=${currentMonth + 1}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderCalendar(data.data);
                } else {
                    console.error('Failed to fetch reservations:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function renderCalendar(reservations) {
        currentDateSpan.textContent = `${currentYear}년 ${currentMonth + 1}월`;
        calendarDiv.innerHTML = '';

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            calendarDiv.appendChild(createDayElement());
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayReservations = reservations.filter(r => {
                const reservationDate = new Date(r.time);
                return reservationDate.getDate() === day;
            });

            calendarDiv.appendChild(createDayElement(day, dayReservations));
        }
    }

    function createDayElement(day, reservations) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (day) {
            dayElement.innerHTML = `
      <h3>${day}일</h3>
      <p class="reservation-count">예약: ${reservations.length}건</p>
      <ul class="reservation-list">
        ${reservations.map(r => `
          <li class="reservation-item">
            <span class="reservation-time">${r.time.split(' ')[1].slice(0, 5)}</span>
            ${r.name}
          </li>
        `).join('')}
      </ul>
    `;
        }

        return dayElement;
    }


    fetchAndRenderCalendar();
});
