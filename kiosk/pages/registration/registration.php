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
      <!-- 안내 텍스트 -->
      <p class="centered-text">무엇을 도와드릴까요?</p>

      <!-- 카드 컨테이너 -->
      <div class="card-container">
        <!-- 초진 카드 -->
        <div class="card" id="initial-visit">
          <div class="card-title">초진</div>
          <div class="card-line"></div>
          <div class="card-subtitle">처음 방문하는</div>
        </div>

        <!-- 재진 카드 -->
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

  <!-- PHP 코드가 실행되는 부분 -->
  <div>
    <?php
    echo "PHP 스크립트 시작!<br>";

    // .env 로드
    require_once __DIR__ . '/../../../vendor/autoload.php';
    echo "Dotenv 로드 성공!<br>";

    use Dotenv\Dotenv;

    try {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
        $dotenv->load();
        echo "환경 변수 로드 성공!<br>";

        // 환경 변수 확인
        echo "DB_HOST: " . $_ENV['DB_HOST'] . "<br>";
    } catch (Exception $e) {
        echo "Dotenv 로드 실패: " . $e->getMessage();
    }
    echo "환경 변수 로드 성공!<br>";

    // MySQL 연결
    $host = $_ENV['DB_HOST'];
    $username = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASSWORD'];
    $database = $_ENV['DB_NAME'];
    $port = $_ENV['DB_PORT'];

    $conn = mysqli_connect($host, $username, $password, $database, $port);

    if (!$conn) {
        die('MySQL 연결 실패: ' . mysqli_connect_error());
    }
    echo "MySQL 연결 성공!<br>";
    ?>  

  </div>

  <script src="registration.js"></script>
</body>
</html>
