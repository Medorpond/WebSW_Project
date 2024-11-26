document.addEventListener("DOMContentLoaded", function () {
    const sections = Array.from(document.querySelectorAll("#reservation > div"));
    let currentIndex = 0;

    // 초기화: 첫 번째 섹션 활성화
    sections[currentIndex].classList.add("active");

    // 버튼 동작 설정
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


    //flatpickr Calendar Library
    const calendarElement = document.getElementById('reservationCalendar');
    const timeSlotsContainer = document.getElementById('reservationTimeSlot');
    flatpickr(calendarElement, {
        inline: true,               // 달력이 화면에 고정되어 보이도록 설정
        enableTime: false,          // 달력에서 직접 시간 선택은 비활성화
        dateFormat: "Y-m-d",        // 날짜 포맷 설정
        minDate: "today",           // 오늘 이후의 날짜만 선택 가능
        enable: [
            function(date) {
                // 요일 인덱스: 0(일요일) ~ 6(토요일)
                const day = date.getDay();
                return (day === 2 || day === 4 || day === 6); // 화(2), 목(4), 토(6)만 활성화
            }
        ],

        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const selectedDate = selectedDates[0];
                const day = selectedDate.getDay();

                // 기존의 시간대 버튼을 초기화
                timeSlotsContainer.innerHTML = '';

                let timeSlots = [];
                // 요일에 따른 가용 시간대 설정
                if (day === 2 || day === 4) {
                    // 화요일(2), 목요일(4): 19:00 - 21:00
                    timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00"];
                } else if (day === 6) {
                    // 토요일(6): 15:00 - 17:00
                    timeSlots = ["15:00", "15:30", "16:00", "16:30", "17:00"];
                }

                // 시간대 버튼을 동적으로 생성
                if (timeSlots.length > 0) {
                    timeSlots.forEach(time => {
                        const button = document.createElement('button');
                        button.textContent = time;
                        button.className = 'time-slot-button';
                        button.addEventListener('click', function() {
                            alert('선택한 시간: ' + time);
                            // 예약 프로세스를 추가 구현할 수 있습니다.
                        });
                        timeSlotsContainer.appendChild(button);
                    });
                }
            }
        }
    });

});


