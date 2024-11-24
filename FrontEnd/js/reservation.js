document.addEventListener("DOMContentLoaded", function () {
    const reservationSections = document.querySelectorAll("#reservation > div");
    let currentSectionIndex = 0;

    // 초기 표시
    reservationSections[currentSectionIndex].classList.add("active");

    // 뒤로가기 및 앞으로가기 버튼 설정
    const backButtons = document.querySelectorAll(".backBtn");
    const nextButtons = document.querySelectorAll(".nextBtn");

    // 현재 섹션의 필수 입력값 검사
    function validateCurrentSection() {
        const inputs = reservationSections[currentSectionIndex].querySelectorAll("input, textarea, select");
        for (const input of inputs) {
            if (!input.checkValidity()) {
                return false;
            }
        }
        return true;
    }

    // 이전 섹션으로 이동
    backButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (currentSectionIndex > 0) {
                reservationSections[currentSectionIndex].classList.remove("active");
                currentSectionIndex -= 1;
                reservationSections[currentSectionIndex].classList.add("active");
                updateNextButtonState();
            }
        });
    });

    // 다음 섹션으로 이동
    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (validateCurrentSection() && currentSectionIndex < reservationSections.length - 1) {
                reservationSections[currentSectionIndex].classList.remove("active");
                currentSectionIndex += 1;
                reservationSections[currentSectionIndex].classList.add("active");
                updateNextButtonState();
            }
        });
    });

    // nextBtn 활성화/비활성화 업데이트
    function updateNextButtonState() {
        const nextButton = reservationSections[currentSectionIndex].querySelector(".nextBtn");
        if (nextButton) {
            nextButton.disabled = !validateCurrentSection();
        }
    }

    // 모든 입력값에 이벤트 리스너 추가
    reservationSections.forEach(section => {
        const inputs = section.querySelectorAll("input, textarea, select");
        inputs.forEach(input => {
            input.addEventListener("input", updateNextButtonState);
        });
    });

    // 초기 상태 업데이트
    updateNextButtonState();
});
