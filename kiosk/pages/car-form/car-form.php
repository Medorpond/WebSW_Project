<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/kiosk/globals.css" />
    <link rel="stylesheet" href="/kiosk/styleguide.css" />
    <link rel="stylesheet" href="car-form.css" />
    <title>Insurance Form</title>
  </head>
  <body>
    <div class="screen">
      <div class="main-container">
        <!-- 안내 텍스트 -->
        <p class="centered-text">자동차 보험 담당자 정보를 입력해주세요</p>

        <!-- 입력 폼 -->
        <form class="input-form">
          <div class="form-group">
            <label for="responsible-name" class="form-label">담당자 이름</label>
            <input
              type="text"
              id="responsible-name"
              class="form-input"
              placeholder="담당자 이름을 입력해주세요"
            />
          </div>

          <div class="form-group">
            <label for="responsible-phone" class="form-label">담당자 휴대폰</label>
            <input
              type="tel"
              id="responsible-phone"
              class="form-input"
              placeholder="담당자 휴대폰 번호를 입력해주세요"
            />
          </div>
        </form>

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
  </body>
</html>
