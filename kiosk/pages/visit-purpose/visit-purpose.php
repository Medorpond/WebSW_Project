<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/kiosk/globals.css" />
    <link rel="stylesheet" href="/kiosk/styleguide.css" />
    <link rel="stylesheet" href="visit-purpose.css" />
    <title>Selection</title>
  </head>
  <body>
    <div class="screen">
      <div class="main-container">
        <!-- 안내 텍스트 -->
        <p class="centered-text">아래 항목 중 방문 목적을 선택해주세요</p>

        <!-- 건강보험 카드 -->
        <div class="card" id="health">
          <p class="card-title">건강보험</p>
        </div>

        <!-- 자동차보험 카드 -->
        <div class="card" id="car">
          <p class="card-title">자동차보험</p>
        </div>

        <!-- 기타 카드 -->
        <div class="card" id="etc">
          <p class="card-title">기타</p>
          <p class="card-subtitle">일반진료, 한약상담</p>
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
    <script src="nav.js"></script>
    <script src="visit-purpose.js"></script>
  </body>
</html>