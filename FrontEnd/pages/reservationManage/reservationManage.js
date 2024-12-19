document.addEventListener("DOMContentLoaded", initAdminResPage);

let resDateOption = {};
let flatpickrInstance;
let currentDayIndex;
let updateTimeout;

function initAdminResPage() {
    // 기존 데이터 로드
    fetch('/BackEnd/data/resDateOption.json')
        .then(response => response.json())
        .then(data => {
            resDateOption = data;
            setupAdminCalendar();
        })
        .catch(err => console.error("Error loading data:", err));

    // 요일 선택 버튼 이벤트 리스너
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', onDayClick);
    });

    document.querySelector('#day-toggle').addEventListener('change', toggleDay);

    // 예약 시간 설정 이벤트 리스너
    document.querySelectorAll('.time-input').forEach(input => {
        input.addEventListener('change', updateTimeSlots);
    });

    // 예약 시간 단위 설정 이벤트 리스너
    document.querySelector('.unit-input').addEventListener('change', updateTimeSlots);

    // 예약 가능 환자 수 설정 이벤트 리스너
    document.querySelector('.patients-input input').addEventListener('change', updateAvailablePatient);

    // 휴무일 설정 이벤트 리스너
    document.querySelectorAll('.date-range input').forEach(input => {
        input.addEventListener('change', debounce(updateHolidays, 300));
    });

    // 저장 버튼 이벤트 리스너
    document.querySelector('.save-btn').addEventListener('click', saveChanges);
}

function setupAdminCalendar() {
    flatpickrInstance = flatpickr("#calendar-container", {
        dateFormat: "Y-m-d",
        inline: true,
        minDate: "today",
        disable: [
            function(date) {
                return isDateDisabled(date);
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

    setupInputListeners();
}

function setupInputListeners() {
    document.querySelector('#day-toggle').addEventListener('change', updateCalendarOnDayChange);
    document.querySelectorAll('.date-range input').forEach(input => {
        input.addEventListener('change', debounce(updateCalendarOnHolidayChange, 300));
    });
}

function updateCalendarOnDayChange() {
    flatpickrInstance.set('disable', [isDateDisabled]);
    flatpickrInstance.redraw();
}

function updateCalendarOnHolidayChange() {
    flatpickrInstance.set('disable', [isDateDisabled]);
    flatpickrInstance.redraw();
}

function isDateDisabled(date) {
    if (!resDateOption.enabledDays.includes(date.getDay())) {
        return true;
    }
    const dateString = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
    return resDateOption.disabledDates.includes(dateString);
}

function debounce(func, delay) {
    return function() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

function updateUIWithData() {
    const dayToggle = document.getElementById('day-toggle');
    const timeInputs = document.querySelectorAll('.time-input');
    const unitInput = document.querySelector('.unit-input');
    const patientsInput = document.querySelector('.patients-input input');
    const isDayActive = resDateOption.enabledDays.includes(currentDayIndex);

    dayToggle.checked = isDayActive;

    if (isDayActive) {
        timeInputs.forEach(input => input.disabled = false);
        unitInput.disabled = false;
        patientsInput.disabled = false;

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
        timeInputs.forEach(input => input.disabled = true);
        unitInput.disabled = true;
        patientsInput.disabled = true;
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
    updateCalendarOnDayChange();
}

function updateTimeSlots() {
    const startTime = document.querySelectorAll('.time-input')[0].value;
    const endTime = document.querySelectorAll('.time-input')[1].value;
    const timeUnit = document.querySelector('.unit-input').value;

    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const endDateTime = new Date(`2000-01-01T${endTime}:00`);

    const timeSlots = [];

    while (currentTime < endDateTime) {
        timeSlots.push(currentTime.toTimeString().slice(0, 5));
        currentTime.setMinutes(currentTime.getMinutes() + parseInt(timeUnit));
    }

    resDateOption.timeSlots[currentDayIndex.toString()] = timeSlots;
    console.log(JSON.stringify(resDateOption, null, 2));
}

function updateHolidays() {
    const startMonth = document.querySelector('#holiday-start .month-input').value;
    const startDay = document.querySelector('#holiday-start .day-input').value;
    const endMonth = document.querySelector('#holiday-end .month-input').value;
    const endDay = document.querySelector('#holiday-end .day-input').value;

    if (startMonth && startDay && endMonth && endDay) {
        const currentYear = new Date().getFullYear();
        let startYear = currentYear;
        let endYear = currentYear;

        let startDate = new Date(startYear, parseInt(startMonth) - 1, parseInt(startDay), 9);
        let endDate = new Date(endYear, parseInt(endMonth) - 1, parseInt(endDay), 9);

        const today = new Date();
        today.setHours(9, 0, 0, 0);

        if (startDate < today) {
            startYear++;
            endYear++;
            startDate.setFullYear(startYear);
            endDate.setFullYear(endYear);
        }

        if (endDate < startDate) {
            endYear++;
            endDate.setFullYear(endYear);
        }

        resDateOption.disabledDates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            resDateOption.disabledDates.push(d.toISOString().split('T')[0]);
        }

        updateCalendarOnHolidayChange();
    }
}

function updateAvailablePatient(event) {
    resDateOption.patientsPerUnit = parseInt(event.target.value);
}

function saveChanges(event) {
    event.preventDefault();
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
            } else {
                alert('설정 저장에 실패했습니다: ' + (data.message || '알 수 없는 오류'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('설정 저장 중 오류가 발생했습니다: ' + error.message);
        });
}
