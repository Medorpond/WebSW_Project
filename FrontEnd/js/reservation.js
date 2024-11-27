// sections 배열 확인 및 초기화
if (!window.sections) {
    window.sections = Array.from(document.querySelectorAll("#reservation > div"));
}

// currentIndex 확인 및 초기화
if (!window.currentIndex) {
    window.currentIndex = 0;
} else {currentIndex = 0;}

// reservationData 객체 확인 및 초기화
if (!window.reservationData) {
    window.reservationData = {
        personalInfo: {
            name: "",
            contact: ""
        },
        resSchedule: {
            date: "",
            time: "",
        }
    };
}

//document.addEventListener("DOMContentLoaded", initPage);
initPage();

function initPage(){
    //필요 라이브러리 추가
    loadLibrary("https://cdn.jsdelivr.net/npm/flatpickr");

    // 버튼 기본 동작 설정
    initButtons();

    // 개인 정보 수집 페이지 초기화
    initUserInputField()

    // 예약 일정 선택 페이지 초기화
    initResSchedule();

    // 예약 정보 확인 페이지 초기화
    initConfirmReservation();

    // 예약 완료 페이지 메인 버튼 초기화
    document.querySelector('#homeBtn').addEventListener('click', () => {
        loadPage('subpage');
    });

    // 초기화: 첫 번째 섹션 활성화
    sections[currentIndex].classList.add("active");

}
function initButtons(){
    document.querySelectorAll(".nextBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentIndex < sections.length - 1) {
                sections[currentIndex].classList.remove("active");
                currentIndex++;
                sections[currentIndex].classList.add("active");
            }
        });
    });
    document.querySelectorAll(".backBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentIndex > 0) {
                sections[currentIndex].classList.remove("active");
                currentIndex--;
                sections[currentIndex].classList.add("active");
            }
        });
    });
}

function initUserInputField(){
    const nameInput = document.getElementById('resName');
    const contactInput = document.getElementById('resContact');
    const agreeCheckbox = document.getElementById('resDataCollectionAgree'); // 개인정보 수집 동의 체크박스
    const nextBtn = document.querySelector('#personalDataCollecting > .nextBtn');

    // 입력 필드 상태 확인 함수
    function validateInputs() {
        // 유효성 검사
        const isNameValid = nameInput.value.trim().length > 0;
        const isContactValid = /^[0-9]{11}$/.test(contactInput.value.trim());
        const isAgreeChecked = agreeCheckbox.checked;

        // 데이터 업데이트
        reservationData.personalInfo.name = isNameValid ? nameInput.value.trim() : "";
        reservationData.personalInfo.contact = isContactValid ? contactInput.value.trim() : "";

        // 버튼 활성화 여부
        nextBtn.disabled = !(isNameValid && isContactValid && isAgreeChecked);
    }

    // 트리거 설정
    nameInput.addEventListener('input', validateInputs);
    contactInput.addEventListener('input', validateInputs);
    agreeCheckbox.addEventListener('change', validateInputs);

    // 초기 상태 설정
    validateInputs();
}

function initResSchedule() {
    const calendarElement = document.getElementById('reservationCalendar');
    const timeSlotsContainer = document.getElementById('reservationTimeSlot');
    const nextBtn = document.querySelector('#visitDateSelection .nextBtn');

    const enabledDays = [];
    const timeSlotMapping = {};

    fetch('./data/resDateOption.json')
        .then(response => {
            if (!response.ok){
                throw new Error("Failed to load config file")
            }
            return response.json();
        })
        .then(data => {
            enabledDays.push(...data.enabledDays); // 배열에 요일 추가
            Object.assign(timeSlotMapping, data.timeSlots); // 객체에 키-값 복사

            flatpickr(calendarElement, {
                inline: true,
                enableTime: false,
                dateFormat: "Y-m-d",
                minDate: "today",
                enable: [
                    date => enabledDays.length > 0 && enabledDays.includes(date.getDay())
                ],

                onChange: function (selectedDates, dateStr) {
                    const selectedDate = selectedDates[0];
                    if (selectedDate) {
                        reservationData.resSchedule.date = dateStr;
                        reservationData.resSchedule.time = null; // 시간 초기화
                        timeSlotsContainer.innerHTML = ""; // 시간대 초기화

                        const day = selectedDate.getDay();
                        const timeSlots = timeSlotMapping[day] || [];

                        timeSlots.forEach(time => {
                            const button = document.createElement('button');
                            button.textContent = time;
                            button.className = "time-slot-button";

                            button.addEventListener("click", function () {
                                reservationData.resSchedule.time = time;
                                document.querySelectorAll('.time-slot-button').forEach(btn => btn.classList.remove('active'));
                                button.classList.add('active');
                                validateSchedule();
                            });

                            timeSlotsContainer.appendChild(button);
                        });

                        validateSchedule();
                    }
                }
            });
        }).catch(error => {
            console.error("Error loading config: ", error);
        })

    function isScheduleValid() {
        return reservationData.resSchedule.date.trim().length > 0 &&
               reservationData.resSchedule.time !== null;
    }

    function validateSchedule() {
        nextBtn.disabled = !isScheduleValid();
    }

    validateSchedule();
}

function initConfirmReservation(){
    const confirmedName = document.getElementById('confirmedName');
    const confirmedContact = document.getElementById('confirmedContact');
    const confirmedDate = document.getElementById('confirmedDate');
    const resConfirmBtn = document.querySelector('#confirmReservationBtn');
    const pageTriggerBtn = document.querySelector('#visitDateSelection > .nextBtn'); // 이전 Division (페이지) id 하드코딩

    resConfirmBtn.addEventListener('click', sendReservationToServer);
    pageTriggerBtn.addEventListener('click', updateReservationData);
    updateReservationData();

    // 예약 정보를 화면에 업데이트
    function updateReservationData() {
        const { name, contact } = reservationData.personalInfo;
        const { date } = reservationData.resSchedule;

        confirmedName.textContent = name || "[이름]";
        confirmedContact.textContent = contact || "[연락처]";
        confirmedDate.textContent = date || "[예약 날짜]";
    }

    // 서버로 데이터 전송
    function sendReservationToServer() {
        // 데이터 검증
        if (!reservationData.personalInfo.name
            || !reservationData.personalInfo.contact
            || !reservationData.resSchedule.date
            || !reservationData.resSchedule.time) {
            alert("예약 정보가 누락되었습니다. 확인 후 다시 시도해주세요.");
            return;
        }

        const requestData = {
            name: reservationData.personalInfo.name,
            contact: reservationData.personalInfo.contact,
            date: reservationData.resSchedule.date,
            time: reservationData.resSchedule.time,
        };

        fetch('../BackEnd/php/updateReservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                sections[currentIndex].classList.remove('active');
                sections[currentIndex + 1].classList.add('active');
            } else {
                alert("예약 처리 중 문제가 발생했습니다: " + (data.message || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("예약 전송 오류:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        });
    }
}


