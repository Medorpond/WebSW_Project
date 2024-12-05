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
        <!-- 안내 텍스트 -->
        <p class="centered-text">아래 정보를 입력해주세요</p>

        <!-- 입력 폼 -->
        <form class="input-form">
          <div class="form-group">
            <label for="name" class="form-label">이름</label>
            <input type="text" id="name" class="form-input" placeholder="이름을 입력해주세요" />
          </div>

          <div class="form-group">
            <label for="id-number" class="form-label">주민번호</label>
            <div class="id-container">
              <input
                type="text"
                id="id-number"
                class="form-input short"
                placeholder="앞 6자리"
                maxlength="6"
              />
              <span class="dash">-</span>
              <input
                type="password"
                class="form-input short"
                placeholder="뒤 7자리"
                maxlength="7"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">휴대폰</label>
            <input type="tel" id="phone" class="form-input" placeholder="전화번호를 입력해주세요" />
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
