<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="registration.css" />
  <title>Registration</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <p class="centered-text">무엇을 도와드릴까요?</p>

      <!-- 카드 컨테이너 -->
      <div class="card-container">
        <div class="card" id="initial-visit">
          <div class="card-title">초진</div>
          <div class="card-line"></div>
          <div class="card-subtitle">처음 방문하는</div>
        </div>

        <div class="card" id="follow-up-visit">
          <div class="card-title">재진</div>
          <div class="card-line"></div>
          <div class="card-subtitle">방문한 적이 있는</div>
        </div>
      </div>
    </div>

    <div class="header">
      <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
    </div>
  </div>

  <!-- PHP -->
  <div>
    <?php
    // PHP 오류 출력 활성화
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // DB 연결 경로 확인
    require_once __DIR__ . '/../../../config/dbconnection.php';

    echo "DB 연결이 성공적으로 설정되었습니다!<br>";
    ?>
  </div>

  <script src="registration.js"></script>
</body>
</html>
