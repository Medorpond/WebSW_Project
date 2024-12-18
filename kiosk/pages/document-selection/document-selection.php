<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="document-selection.css" />
  <title>Document Selection</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <p class="centered-text">아래 항목을 선택해주세요</p>

      <!-- 선택 항목 폼 시작 -->
      <form class="document-form" id="document-form" method="POST" action="process.php">
        <input type="hidden" name="patient_id" value="<?php echo htmlspecialchars($_GET['patient_id']); ?>" />
        <input type="hidden" name="selected_documents" id="selected-documents" />

        <!-- 선택 항목 -->
        <div class="box" data-value="0">
          <p class="text-wrapper">필요없음</p>
        </div>
        <div class="box" data-value="1">
          <p class="text-wrapper">실비 보험 청구 서류</p>
        </div>
        <div class="box" data-value="2">
          <p class="text-wrapper">진료확인서</p>
        </div>
        <div class="box" data-value="3">
          <p class="text-wrapper">기타 진단서 관련 서류</p>
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
  <script src="document-selection.js"></script>
</body>
</html>
