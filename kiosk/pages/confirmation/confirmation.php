<?php
// URL 데이터 받기
$patient_name = htmlspecialchars($_GET['patient_name'] ?? '손님');
$patient_id = intval($_GET['patient_id'] ?? 0);
?>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="confirmation.css">
  <title>본인 확인</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <p class="centered-text">본인 확인</p>

      <!-- 사용자 이름 -->
      <p class="username-text"><?php echo $patient_name; ?> 님</p>

      <!-- 선택 버튼 -->
      <div class="button-container">
        <a href="/kiosk/pages/document-selection/document-selection.php?patient_id=<?php echo $patient_id; ?>" class="option-box">네</a>
        <a href="/kiosk/pages/exist-information/exist-information.php" class="option-box">아니요</a>
      </div>
    </div>
    <div class="header">
      <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
    </div>
  </div>
</body>
</html>
