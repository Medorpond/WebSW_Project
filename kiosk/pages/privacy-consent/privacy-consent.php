<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/kiosk/globals.css" />
    <link rel="stylesheet" href="/kiosk/styleguide.css" />
    <link rel="stylesheet" href="privacy-consent.css" />
    <title>Privacy Consent</title>
  </head>
  <body>
    <div class="screen">
      <div class="main-container">
        <!-- 안내 텍스트 -->
        <div class="centered-text">아래 서명란에 서명해주세요</div>

        <!-- 개인정보 동의 -->
        <div class="consent-box">
          <p class="consent-title">개인정보 수집 및 이용에 대한 동의</p>
          <p class="consent-description">
            대운한의원은 진료 서비스 제공을 위해 이름, 주민등록번호(암호화 저장), 성별, 주소를 수집 및 이용합니다.
            자세한 내용을 확인하시려면 아래 버튼을 클릭해 주세요.
          </p>

          <!-- 동의 체크박스 -->
          <div class="option-wrapper">
            <div class="agree">
              <div class="agree-text">동의함</div>
              <div class="agree-box" id="agree-box"></div>
            </div>
            <div class="more-info">
              <button type="button" class="info-button" onclick="showMoreInfo()">자세히 보기</button>
            </div>
          </div>
        </div>

        <!-- 서명 캔버스 -->
        <canvas id="signatureCanvas" class="signature-canvas"></canvas>

        <!-- 서명 지우기 버튼 -->
        <div class="button-container">
          <button class="clear-button" onclick="clearCanvas()">서명 지우기</button>
        </div>

        <!-- 네비게이션 버튼 -->
        <div class="nav-buttons">
          <div class="nav-button previous" id="previous">
            <img
              class="nav-icon"
              src="/kiosk/assets/img/previousbutton.png"
              alt="Previous"
            />
          </div>
          <div class="nav-button next" id="next">
            <img
              class="nav-icon"
              src="/kiosk/assets/img/nextbutton.png"
              alt="Next"
            />
          </div>
        </div>
      </div>

      <div class="header">
        <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
      </div>
    </div>

    <!-- JavaScript 코드 -->
    <script>
      const agreeBox = document.getElementById("agree-box");
      const nextPage = document.getElementById("next");
      const signatureCanvas = document.getElementById("signatureCanvas");

      // 동의 박스 클릭 이벤트
      agreeBox.addEventListener("click", () => {
        agreeBox.classList.toggle("selected");
        console.log("동의 상태:", agreeBox.classList.contains("selected"));
      });

      // 서명 캔버스 확인 함수
      function isCanvasSigned(canvas) {
        const context = canvas.getContext("2d");
        const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // 캔버스에 그려진 내용 확인
        return Array.from(pixelData).some((pixel) => pixel !== 0);
      }

      // 다음 버튼 클릭 이벤트
      nextPage.addEventListener("click", () => {
        const isAgreed = agreeBox.classList.contains("selected");
        const isSigned = isCanvasSigned(signatureCanvas);

        if (!isAgreed) {
          alert("개인정보 수집 및 이용에 동의해주세요.");
          return;
        }

        if (!isSigned) {
          alert("서명란에 서명을 완료해주세요.");
          return;
        }

        // 동의 및 서명 확인 시 페이지 이동
        window.location.href = "/kiosk/pages/information-form/information-form.php";
      });

      // 이전 버튼 클릭 이벤트
      const previousPage = document.getElementById("previous");
      previousPage.addEventListener("click", () => {
        window.history.back();
      });

      // 서명 지우기 함수
      function clearCanvas() {
        const ctx = signatureCanvas.getContext("2d");
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      }

      // 정보 보기 버튼 동작
      function showMoreInfo() {
        alert("개인정보 수집 및 이용에 대한 자세한 정보는 병원 안내 데스크에서 확인하세요.");
      }
    </script>
    <script src="privacy-consent.js"></script>
  </body>
</html>