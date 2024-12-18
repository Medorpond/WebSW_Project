<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/kiosk/globals.css" />
    <link rel="stylesheet" href="/kiosk/styleguide.css" />
    <link rel="stylesheet" href="information-form.css" />
    <title>Information Form</title>
  </head>
  <body>
    <div class="screen">
      <div class="main-container">
        <p class="centered-text">아래 정보를 입력해주세요</p>

        <!-- 입력 폼 -->
        <form class="input-form" id="info-form" method="POST" action="process.php">
          <!-- 이름 -->
          <div class="form-group">
            <label for="name" class="form-label">이름</label>
            <input type="text" name="name" id="name" class="form-input" placeholder="이름을 입력해주세요" required />
          </div>

          <!-- 주민번호 -->
          <div class="form-group">
            <label for="ssn_front" class="form-label">주민번호</label>
            <div class="id-container">
              <input
                type="text"
                name="ssn_front"
                id="ssn_front"
                class="form-input short"
                placeholder="앞 6자리"
                maxlength="6"
                required
              />
              <span class="dash">-</span>
              <input
                type="password"
                name="ssn_back"
                id="ssn_back"
                class="form-input short"
                placeholder="뒤 7자리"
                maxlength="7"
                required
              />
            </div>
          </div>

          <!-- 휴대폰 -->
          <div class="form-group">
            <label for="phone_number" class="form-label">휴대폰</label>
            <input type="tel" name="phone_number" id="phone_number" class="form-input" placeholder="전화번호를 입력해주세요" required />
          </div>

          <!-- 동의 여부 (이전 페이지에서 POST로 전달됨) -->
          <input type="hidden" name="consent" value="<?php echo htmlspecialchars($_POST['consent'] ?? '0'); ?>" />

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
      // 이전 버튼 동작
      const previousPage = document.getElementById("previous");

      // 이전 버튼 클릭 시 브라우저 뒤로 이동
      previousPage.addEventListener("click", () => {
        window.history.back();
      });

      // 폼 제출 시 유효성 검사
      const form = document.getElementById("info-form");
      form.addEventListener("submit", (event) => {
        const nameInput = document.getElementById("name").value.trim();
        const ssnFrontInput = document.getElementById("ssn_front").value.trim();
        const ssnBackInput = document.getElementById("ssn_back").value.trim();
        const phoneInput = document.getElementById("phone_number").value.trim();

        if (!nameInput) {
          alert("이름을 입력해주세요.");
          event.preventDefault();
          return;
        }

        if (ssnFrontInput.length !== 6) {
          alert("주민번호 앞 6자리를 정확히 입력해주세요.");
          event.preventDefault();
          return;
        }

        if (ssnBackInput.length !== 7) {
          alert("주민번호 뒤 7자리를 정확히 입력해주세요.");
          event.preventDefault();
          return;
        }

        if (!/^\d{10,11}$/.test(phoneInput)) {
          alert("유효한 전화번호를 입력해주세요.");
          event.preventDefault();
          return;
        }
      });
    </script>

  </body>
</html>
