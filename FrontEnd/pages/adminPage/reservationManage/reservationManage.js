document.addEventListener("DOMContentLoaded", initAdminResPage);

let resDateOption = {};
let flatpickrInstance;
let currentDayIndex;

function initAdminResPage() {
    // 기존 데이터 로드
    fetch('/data/resDateOption.json')
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
    document.querySelector('.patients-input input').addEventListener('change', updateAvailablePatient)

    // 휴무일 설정 이벤트 리스너
    document.querySelectorAll('.date-range input').forEach(input => {
        input.addEventListener('change', updateHolidays);
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
    document.querySelector('#day-toggle').addEventListener('change', updateCalendarOnInput);

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
}

function updateCalendarOnInput() {
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


function updateUIWithData() {
    const dayToggle = document.getElementById('day-toggle');
    const timeInputs = document.querySelectorAll('.time-input');
    const unitInput = document.querySelector('.unit-input');
    const patientsInput = document.querySelector('.patients-input input');

    const isDayActive = resDateOption.enabledDays.includes(currentDayIndex);

    dayToggle.checked = isDayActive;

    if(isDayActive){
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
        }
        else{
            unitInput.value = 0;
        }

        patientsInput.value = resDateOption.patientsPerUnit;
    }
    else{
        timeInputs.forEach(input => input.disabled = true);
        unitInput.disabled = true;
        patientsInput.disabled = true;
    }
}

function onDayClick(event) {
    // 누른 요소의 Index 추출
    currentDayIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
    // 각 Day의 'active' 클래스 토글
    Array.from(event.target.parentNode.children).forEach(element => {
        element.classList.remove('active');
    });

    event.target.classList.add('active');

    updateUIWithData();
}

function toggleDay(event){
    if (event.target.checked) {
        resDateOption.enabledDays.push(currentDayIndex);
    } else {
        resDateOption.enabledDays = resDateOption.enabledDays.filter(day => day !== currentDayIndex);
    }

    updateUIWithData();
}

function updateTimeSlots() {
    const startTime = document.querySelectorAll('.time-input')[0].value;
    const endTime = document.querySelectorAll('.time-input')[1].value;
    const timeUnit = document.querySelector('.unit-input').value;

    // 시작 시간과 종료 시간을 Date 객체로 변환
    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const endDateTime = new Date(`2000-01-01T${endTime}:00`);

    // timeSlots 배열 생성
    const timeSlots = [];

    // 시작 시간부터 종료 시간까지 timeUnit 간격으로 시간 추가
    while (currentTime < endDateTime) {
        timeSlots.push(currentTime.toTimeString().slice(0, 5));
        currentTime.setMinutes(currentTime.getMinutes() + timeUnit);
    }

    // resDateOption의 timeSlots 업데이트
    resDateOption.timeSlots[currentDayIndex.toString()] = timeSlots;

    // JSON 형태로 출력 (테스트용)
    console.log(JSON.stringify(resDateOption, null, 2));
}

function updateHolidays() {
    alert("Update begins");

    const startMonth = document.querySelector('#holiday-start .month-input').value;
    const startDay = document.querySelector('#holiday-start .day-input').value;
    const endMonth = document.querySelector('#holiday-end .month-input').value;
    const endDay = document.querySelector('#holiday-end .day-input').value;

    if (startMonth && startDay && endMonth && endDay) {
        const currentYear = new Date().getFullYear();
        let startYear = currentYear;
        let endYear = currentYear;

        // 시작 날짜와 종료 날짜 생성
        let startDate = new Date(startYear, parseInt(startMonth) - 1, parseInt(startDay), 9);
        let endDate = new Date(endYear, parseInt(endMonth) - 1, parseInt(endDay), 9);

        // 오늘 날짜
        const today = new Date();
        today.setHours(9, 0, 0, 0);

        // 시작 날짜가 오늘보다 이전이면 내년으로 설정
        if (startDate < today) {
            startYear++;
            endYear++;
            startDate.setFullYear(startYear);
            endDate.setFullYear(endYear);
        }

        // 종료 날짜가 시작 날짜보다 이전이면 내년으로 설정
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

function updateAvailablePatient(event){
    // 환자 수 저장
    resDateOption.patientsPerUnit = parseInt(event.value);
}

function saveChanges(event) {
    event.preventDefault();

    fetch('NEEDUPDATE.php', {
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