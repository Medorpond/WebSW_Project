document.addEventListener("DOMContentLoaded", initPage);

function initPage() {
    // 예약 정보 초기화
    fetch('/BackEnd/data/resDateOption.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // data가 유효한지 확인
            if (!data || !data.enabledDays || !data.timeSlots) {
                throw new Error("Invalid data structure");
            }

            const availableDays = data.enabledDays.map(day => getDayName(day)).join(", ");
            const timeSlots = Object.entries(data.timeSlots).map(([day, times]) =>
                `${getDayName(day)}: ${times.join(", ")}`
            ).join("<br>");

            document.querySelector("#available-days span").innerHTML = availableDays;
            document.querySelector("#available-times span").innerHTML = timeSlots;

            // flatpickr 달력 생성
            setupCalendar(data);
        })
        .catch(err => console.error("Error loading JSON data:", err));

    document.querySelector("#calendar-container").addEventListener("change", updateConfirmation);
    document.querySelector("#time-selector").addEventListener("click", event => {
        if (event.target.classList.contains("time-btn")) {
            document.querySelectorAll(".time-btn").forEach(btn => btn.classList.remove("selected"));
            event.target.classList.add("selected");
            updateConfirmation();
        }
    });

    // 예약하기 버튼 클릭 이벤트
    document.querySelector(".submit-btn").addEventListener("click", event => {
        event.preventDefault();

        // 예약 데이터
        const reservationData = {
            name: document.querySelector("#name").value,
            contact: document.querySelector("#phone").value,
            time: document.querySelector("#calendar-container").value + " " +
                (document.querySelector(".time-btn.selected")?.textContent || "") + ":00",
            privacyAgreement: document.querySelector("#privacy-agreement").checked
        };

        if (!reservationData.name || !reservationData.contact || !reservationData.time || !reservationData.privacyAgreement) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        // PHP로 예약 요청 전송
        fetch('/BackEnd/php/updateReservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: reservationData.name,
                contact: reservationData.contact,
                time: reservationData.time
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("예약이 성공적으로 완료되었습니다!");
                    window.location.href = "/FrontEnd/pages/reservation/reservation.html";
                } else {
                    alert(data.message || "예약에 실패했습니다. 다시 시도해주세요.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("예약 처리 중 오류가 발생했습니다.");
            });
    });
}

// 요일 이름 반환
function getDayName(dayIndex) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[dayIndex % 7];
}

function setupCalendar(data) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const minDate = currentTime < 1800 ? now : new Date(now.setDate(now.getDate() + 1));

    flatpickr("#calendar-container", {
        dateFormat: "Y-m-d",
        inline: true,
        minDate: "today",
        disable: [
            function(date) {
                // 요일 체크
                if (!data.enabledDays.includes(date.getDay())) {
                    return true;
                }
                // 특정 날짜 체크
                const dateString = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
                return data.disabledDates.includes(dateString);
            }
        ],
        onChange: function(selectedDates, dateStr, instance) {
            updateTimeSelector(data, new Date(dateStr).getDay());
        },
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

// 시간 선택 버튼 동적 업데이트
function updateTimeSelector(data, dayIndex) {
    const timeSelector = document.querySelector("#time-selector");
    timeSelector.innerHTML = ""; // 초기화

    const times = data.timeSlots[dayIndex] || [];
    if (times.length === 0) {
        timeSelector.innerHTML = "<p>선택한 날짜에 예약 가능한 시간이 없습니다.</p>";
        return;
    }

    times.forEach(time => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = time;
        btn.classList.add("time-btn");

        if (Math.random() < 0.3) { // 30% 확률로 비활성화 (더미데이터)
            btn.disabled = true;
        }

        timeSelector.appendChild(btn);
    });
}


// 예약 확인 정보 업데이트
function updateConfirmation() {
    const name = document.querySelector("#name").value;
    const date = document.querySelector("#calendar-container").value;
    const time = document.querySelector(".time-btn.selected")?.textContent || "";
    const confirmationDiv = document.querySelector(".confirmation");
    const confirmationText = document.querySelector("#confirmation-text");

    if (name && date && time) {
        const [year, month, day] = date.split("-");
        const dayIndex = new Date(date).getDay();
        confirmationText.textContent = `${name} 님, ${year}.${month}.${day}. (${getDayName(dayIndex)}) ${time}`;
        confirmationDiv.style.display = "block";
    } else {
        confirmationDiv.style.display = "none";
    }
}
