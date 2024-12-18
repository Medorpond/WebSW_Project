<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>Selection</title>
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="visit-purpose.css" />
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <p class="centered-text">아래 항목 중 방문 목적을 선택해주세요</p>

      <!-- 방문 목적 폼 -->
      <form class="visit-form" id="visit-form" method="POST" action="process.php">
        <input type="hidden" name="patient_id" value="<?php echo htmlspecialchars($_GET['patient_id']); ?>" />
        <input type="hidden" name="application_id" value="<?php echo htmlspecialchars($_GET['application_id']); ?>" />
        <input type="hidden" name="purpose" id="selected-purpose" required />

        <!-- 건강보험 카드 -->
        <div class="card" data-value="health">
          <p class="card-title">건강보험</p>
        </div>

        <!-- 자동차보험 카드 -->
        <div class="card" data-value="car">
          <p class="card-title">자동차보험</p>
        </div>

        <!-- 기타 카드 -->
        <div class="card" data-value="etc">
          <p class="card-title">기타</p>
          <p class="card-subtitle">일반진료, 한약상담</p>
        </div>

        <!-- 네비게이션 버튼 -->
        <div class="nav-buttons">
          <div class="nav-button previous" id="previous">
            <img class="nav-icon" src="/kiosk/assets/img/previousbutton.png" alt="Previous" />
          </div>
          <button type="submit" class="nav-button next" id="next">
            <img class="nav-icon" src="/kiosk/assets/img/nextbutton.png" alt="Next" />
          </button>
        </div>
      </form>
    </div>

    <div class="header">
      <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
    </div>
  </div>

  <script>
    // 선택된 방문 목적 저장
    let selectedPurpose = null;

    // 카드 선택 로직
    const cards = document.querySelectorAll(".card");
    const purposeInput = document.getElementById("selected-purpose");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // 모든 카드 선택 상태 초기화
        cards.forEach((c) => c.classList.remove("selected"));

        // 현재 선택된 카드 활성화
        card.classList.add("selected");
        selectedPurpose = card.dataset.value;
        purposeInput.value = selectedPurpose;
      });
    });

    // 이전 버튼 동작
    const previousPage = document.getElementById("previous");
    previousPage.addEventListener("click", () => {
      window.history.back();
    });

    // 폼 제출 시 유효성 검사
    const visitForm = document.getElementById("visit-form");
    visitForm.addEventListener("submit", (e) => {
      if (!selectedPurpose) {
        e.preventDefault();
        alert("방문 목적을 선택해주세요!");
      }
    });
  </script>
</body>
</html>
