<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="exist-information.css">
  <title>정보 입력</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <!-- 안내 텍스트 -->
      <p class="centered-text">아래 정보를 입력해주세요</p>
      
      <!-- 입력 필드 -->
      <div class="input-container">
        <label for="phone" class="input-label">휴대폰</label>
        <input id="phone" type="text" class="input-field" placeholder="휴대폰 번호를 입력하세요">
        
        <label for="id-front" class="input-label">주민번호 앞자리</label>
        <div class="id-input-group">
          <input id="id-front" type="text" class```="input-field" maxlength="6" placeholder="앞자리">
          <span class="dash">-</span>
          <input id="id-back" type="text" class="input-field" maxlength="1" placeholder="뒤 첫 자리">
        </div>
      </div>
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
  <script src="nav.js"></script>`
</body>
</html>
