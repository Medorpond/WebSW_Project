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
          <div class="option-wrapper">
            <div class="agree">
              <div class="agree-text">동의함</div>
              <div class="agree-box"></div>
            </div>
            <div class="more-info">
              <div class="info-button">자세히 보기</div>
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
    <script src="privacy-consent.js"></script>
    <script src="nav.js"></script>
  </body>
</html>
