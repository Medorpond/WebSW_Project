document.addEventListener("DOMContentLoaded", initAdminResPage);

let resDateOption = {};
let flatpickrInstance;
let currentDayIndex;

function initAdminResPage() {
    fetch('/BackEnd/data/resDateOption.json')
        .then(response => response.json())
        .then(data => {
            resDateOption = data;
            setupAdminCalendar();
            updateUIWithData();
        })
        .catch(err => console.error("Error loading data:", err));

    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', onDayClick);
    });

    document.querySelector('#day-toggle').addEventListener('change', toggleDay);
    document.querySelector('.save-btn').addEventListener('click', saveChanges);
}

function setupAdminCalendar() {
    flatpickrInstance = flatpickr("#calendar-container", {
        dateFormat: "Y-m-d",
        inline: true,
        minDate: "today",
        disable: [
            function(date) {
                if (!resDateOption.enabledDays.includes(date.getDay())) {
                    return true;
                }
                const dateString = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
                return resDateOption.disabledDates.includes(dateString);
            }
        ],
        monthSelectorType: 'static',
        altFormat: "Y.m",
        altInput: true,
        appendTo: document.querySelector("#calendar-container"),
        locale: {
            months: {
                shorthand: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                longhand: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            }
        },
        onReady: function(dateObj, dateStr, instance) {
            const yearElement = instance.currentYearElement;
            const monthElement = instance.monthElements[0];
            const monthParent = monthElement.parentNode;
            monthParent.insertBefore(yearElement, monthElement);
            yearElement.style.width = '70px';
            yearElement.style.border = 'none';
            yearElement.style.backgroundColor = 'transparent';
            yearElement.readOnly = true;
        }
    });
}

function updateUIWithData() {
    const dayToggle = document.getElementById('day-toggle');
    const timeInputs = document.querySelectorAll('.time-input');
    const unitInput = document.querySelector('.unit-input');
    const patientsInput = document.querySelector('.patients-input input');
    const isDayActive = resDateOption.enabledDays.includes(currentDayIndex);

    dayToggle.checked = isDayActive;

    timeInputs.forEach(input => input.disabled = !isDayActive);
    unitInput.disabled = !isDayActive;
    patientsInput.disabled = !isDayActive;

    if (isDayActive) {
        const timeSlots = resDateOption.timeSlots[currentDayIndex.toString()];
        if (timeSlots && timeSlots.length > 0) {
            timeInputs[0].value = timeSlots[0];
            timeInputs[1].value = timeSlots[timeSlots.length - 1];
        }
        if (timeSlots && timeSlots.length > 1) {
            const startTime = new Date(`1970-01-01T${timeSlots[0]}`);
            const endTime = new Date(`1970-01-01T${timeSlots[1]}`);
            unitInput.value = (endTime - startTime) / (1000 * 60);
        } else {
            unitInput.value = 0;
        }
        patientsInput.value = resDateOption.patientsPerUnit;
    } else {
        timeInputs.forEach(input => input.value = '');
        unitInput.value = '';
        patientsInput.value = '';
    }
}

function onDayClick(event) {
    currentDayIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    Array.from(event.target.parentNode.children).forEach(element => {
        element.classList.remove('active');
    });
    event.target.classList.add('active');
    updateUIWithData();
}

function toggleDay(event) {
    if (event.target.checked) {
        resDateOption.enabledDays.push(currentDayIndex);
    } else {
        resDateOption.enabledDays = resDateOption.enabledDays.filter(day => day !== currentDayIndex);
    }
    updateUIWithData();
    updateCalendarOnInput();
}

function updateCalendarOnInput() {
    flatpickrInstance.set('disable', [
        function(date) {
            if (!resDateOption.enabledDays.includes(date.getDay())) {
                return true;
            }
            const dateString = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
            return resDateOption.disabledDates.includes(dateString);
        }
    ]);
    flatpickrInstance.redraw();
}

function saveChanges(event) {
    event.preventDefault();

    updateResDateOption();

    fetch('/BackEnd/php/resDateOptionHandler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resDateOption)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('설정이 성공적으로 저장되었습니다.');
                setupAdminCalendar();
            } else {
                alert('설정 저장에 실패했습니다: ' + (data.message || '알 수 없는 오류'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('설정 저장 중 오류가 발생했습니다: ' + error.message);
        });
}

function updateResDateOption() {
    resDateOption.enabledDays = [];
    document.querySelectorAll('.day-btn').forEach((btn, index) => {
        if (btn.classList.contains('active')) {
            resDateOption.enabledDays.push(index);
        }
    });

    const startTime = document.querySelectorAll('.time-input')[0].value;
    const endTime = document.querySelectorAll('.time-input')[1].value;
    const timeUnit = parseInt(document.querySelector('.unit-input').value);

    resDateOption.timeSlots = {};
    resDateOption.enabledDays.forEach(day => {
        let currentTime = new Date(`2000-01-01T${startTime}:00`);
        const endDateTime = new Date(`2000-01-01T${endTime}:00`);
        const timeSlots = [];

        while (currentTime <= endDateTime) {
            timeSlots.push(currentTime.toTimeString().slice(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + timeUnit);
        }

        resDateOption.timeSlots[day] = timeSlots;
    });

    resDateOption.patientsPerUnit = parseInt(document.querySelector('.patients-input input').value);

    const startMonth = document.querySelector('#holiday-start .month-input').value;
    const startDay = document.querySelector('#holiday-start .day-input').value;
    const endMonth = document.querySelector('#holiday-end .month-input').value;
    const endDay = document.querySelector('#holiday-end .day-input').value;

    if (startMonth && startDay && endMonth && endDay) {
        const currentYear = new Date().getFullYear();
        let startYear = currentYear;
        let endYear = currentYear;

        let startDate = new Date(startYear, parseInt(startMonth) - 1, parseInt(startDay));
        let endDate = new Date(endYear, parseInt(endMonth) - 1, parseInt(endDay));

        if (endDate < startDate) {
            endYear++;
            endDate.setFullYear(endYear);
        }

        resDateOption.disabledDates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            resDateOption.disabledDates.push(d.toISOString().split('T')[0]);
        }
    }
}
