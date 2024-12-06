document.addEventListener("DOMContentLoaded", initAdminResPage);

let resDateOption = {};
let flatpickrInstance;

function initAdminResPage() {
    // 기존 데이터 로드
    fetch('/data/resDateOption.json')
        .then(response => response.json())
        .then(data => {
            resDateOption = data;
            setupAdminCalendar();
            updateUIWithData();
        })
        .catch(err => console.error("Error loading JSON data:", err));

    // 요일 선택 버튼 이벤트 리스너
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', toggleDay);
    });

    // 예약 시간 설정 이벤트 리스너
    document.querySelectorAll('.time-input').forEach(input => {
        input.addEventListener('change', updateTimeSlots);
    });

    // 예약 시간 단위 설정 이벤트 리스너
    document.querySelector('.unit-input').addEventListener('change', updateTimeSlots);

    // 휴무일 설정 이벤트 리스너
    document.querySelectorAll('.date-range input').forEach(input => {
        input.addEventListener('change', updateHolidays);
    });

    // 당일 휴무 토글 이벤트 리스너
    document.querySelector('#holiday-toggle').addEventListener('change', toggleSingleDayHoliday);

    // 저장 버튼 이벤트 리스너
    document.querySelector('.save-btn').addEventListener('click', saveChanges);
}

function setupAdminCalendar() {
    flatpickrInstance = flatpickr("#calendar-container", {
        dateFormat: "Y-m-d",
        inline: true,
        disable: [
            function(date) {
                // 요일 체크
                if (!resDateOption.enabledDays.includes(date.getDay())) {
                    return true;
                }
                // 특정 날짜 체크
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

    // 입력값 변경 시 달력 업데이트
    setupInputListeners();
}

function setupInputListeners() {
    // 요일 선택 버튼 리스너
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', updateCalendarOnInput);
    });

    // 예약 시간 입력 리스너
    document.querySelectorAll('.time-input').forEach(input => {
        input.addEventListener('change', updateCalendarOnInput);
    });

    // 예약 시간 단위 입력 리스너
    document.querySelector('.unit-input').addEventListener('change', updateCalendarOnInput);

    // 휴무일 입력 리스너
    document.querySelectorAll('.date-range input').forEach(input => {
        input.addEventListener('change', updateCalendarOnInput);
    });

    // 당일 휴무 토글 리스너
    document.querySelector('#holiday-toggle').addEventListener('change', updateCalendarOnInput);
}

function updateCalendarOnInput() {
    // 입력값에 따라 resDateOption 업데이트
    updateResDateOption();

    // flatpickr 인스턴스 업데이트
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

function updateResDateOption() {
    // 요일 설정 업데이트
    resDateOption.enabledDays = Array.from(document.querySelectorAll('.day-btn.active')).map(btn =>
        ['일', '월', '화', '수', '목', '금', '토'].indexOf(btn.textContent)
    );

    // 시간 설정 업데이트
    const startTime = document.querySelectorAll('.time-input')[0].value;
    const endTime = document.querySelectorAll('.time-input')[1].value;
    resDateOption.timeSlots = [`${startTime}-${endTime}`];

    // 시간 단위 업데이트
    resDateOption.timeUnit = parseInt(document.querySelector('.unit-input').value);

    // 휴무일 업데이트
    updateHolidayDates();
}

function updateHolidayDates() {
    const startMonth = document.querySelector('#holiday-start .month-input').value;
    const startDay = document.querySelector('#holiday-start .day-input').value;
    const endMonth = document.querySelector('#holiday-end .month-input').value;
    const endDay = document.querySelector('#holiday-end .day-input').value;

    if (startMonth && startDay && endMonth && endDay) {
        const startDate = new Date(new Date().getFullYear(), startMonth - 1, startDay);
        const endDate = new Date(new Date().getFullYear(), endMonth - 1, endDay);

        resDateOption.disabledDates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            resDateOption.disabledDates.push(d.toISOString().split('T')[0]);
        }
    }

    // 당일 휴무 처리
    if (document.querySelector('#holiday-toggle').checked) {
        const today = new Date().toISOString().split('T')[0];
        if (!resDateOption.disabledDates.includes(today)) {
            resDateOption.disabledDates.push(today);
        }
    }
}

function updateUIWithData() {
    // 요일 버튼 업데이트
    resDateOption.enabledDays.forEach(day => {
        document.querySelectorAll('.day-btn')[day].classList.add('active');
    });

    // 시간 설정 업데이트
    const [startTime, endTime] = resDateOption.timeSlots[0].split('-');
    document.querySelectorAll('.time-input')[0].value = startTime;
    document.querySelectorAll('.time-input')[1].value = endTime;

    // 시간 단위 업데이트
    document.querySelector('.unit-input').value = resDateOption.timeUnit;

    // 환자 수 업데이트
    document.querySelector('.patients-input input').value = resDateOption.patientsPerUnit;

    updateCalendarView();
}

function toggleDay(event) {
    const dayIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    event.target.classList.toggle('active');

    if (event.target.classList.contains('active')) {
        resDateOption.enabledDays.push(dayIndex);
    } else {
        resDateOption.enabledDays = resDateOption.enabledDays.filter(day => day !== dayIndex);
    }

    updateCalendarView();
}

function updateTimeSlots() {
    const startTime = document.querySelectorAll('.time-input')[0].value;
    const endTime = document.querySelectorAll('.time-input')[1].value;
    const timeUnit = document.querySelector('.unit-input').value;

    resDateOption.timeSlots = [`${startTime}-${endTime}`];
    resDateOption.timeUnit = parseInt(timeUnit);

    updateCalendarView();
}

function updateHolidays() {
    const startMonth = document.querySelector('#holiday-start .month-input').value;
    const startDay = document.querySelector('#holiday-start .day-input').value;
    const endMonth = document.querySelector('#holiday-end .month-input').value;
    const endDay = document.querySelector('#holiday-end .day-input').value;

    if (startMonth && startDay && endMonth && endDay) {
        const startDate = new Date(new Date().getFullYear(), startMonth - 1, startDay);
        const endDate = new Date(new Date().getFullYear(), endMonth - 1, endDay);

        resDateOption.disabledDates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            resDateOption.disabledDates.push(d.toISOString().split('T')[0]);
        }

        updateCalendarView();
    }
}

function toggleSingleDayHoliday() {
    const isChecked = document.querySelector('#holiday-toggle').checked;
    if (isChecked) {
        document.querySelector('#calendar-container').classList.add('holiday-mode');
    } else {
        document.querySelector('#calendar-container').classList.remove('holiday-mode');
    }
}

function toggleDateDisable(dateStr) {
    const index = resDateOption.disabledDates.indexOf(dateStr);
    if (index > -1) {
        resDateOption.disabledDates.splice(index, 1);
    } else {
        resDateOption.disabledDates.push(dateStr);
    }
    updateCalendarView();
}

function updateCalendarView() {
    flatpickrInstance.set('disable', resDateOption.disabledDates);
    flatpickrInstance.redraw();
}

function saveChanges(event) {
    event.preventDefault();

    // 환자 수 저장
    resDateOption.patientsPerUnit = parseInt(document.querySelector('.patients-input input').value);

    // 서버로 데이터 전송 (실제 구현 필요)
    fetch('/update-reservation-options', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resDateOption)
    })
    .then(response => response.json())
    .then(data => {
        alert('설정이 저장되었습니다.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('설정 저장에 실패했습니다.');
    });
}