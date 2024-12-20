<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // DB 연결
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // URL에서 patient_id 받기
    $patient_id = filter_input(INPUT_GET, 'patient_id', FILTER_VALIDATE_INT);

    if (!$patient_id) {
        throw new Exception("유효하지 않은 환자 ID입니다.");
    }

    // 환자 이름 조회 쿼리
    $sql = "SELECT name FROM Patient WHERE patient_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL 준비 실패: " . $conn->error);
    }

    $stmt->bind_param("i", $patient_id);
    $stmt->execute();
    $stmt->bind_result($patient_name);
    $stmt->fetch();

    if (empty($patient_name)) {
        throw new Exception("환자 정보를 찾을 수 없습니다.");
    }
} catch (Exception $e) {
    die("오류 발생: " . htmlspecialchars($e->getMessage()));
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="complete-msg.css" />
  <title>Completion Page</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <!-- 안내 텍스트 -->
      <div class="centered-text">접수가 완료되었습니다.</div>

      <!-- 완료 메시지 -->
      <div class="completion-message">
        <span id="user-name"><?php echo htmlspecialchars($patient_name); ?></span>님,<br />
        이용해 주셔서 감사합니다.         
      </div>
      <p class="countdown-text">
        <span id="countdown">5</span> 초 뒤에 접수 화면으로 돌아갑니다.<br><br> 대기실에서 호출 대기 부탁드립니다.
      </p>
    </div>
    <div class="header">
      <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
    </div>
  </div>

  <script>
    // 5초 후 메인 페이지로 이동
    let countdown = 5;
    const countdownDisplay = document.getElementById("countdown");

    const interval = setInterval(() => {
      countdown--;
      countdownDisplay.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = "/kiosk/pages/registration/registration.php";
      }
    }, 1000);
  </script>
</body>
</html>
