<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="car-information.css" />
  <title>Dropdown Form</title>
</head>
<body>
  <div class="screen">
    <div class="main-container">
      <p class="centered-text">아래 항목을 선택 및 입력해주세요</p>

      <!-- 입력 폼 -->
      <form class="input-form" id="car-info-form" method="POST" action="process.php">
        <!-- 환자 ID (히든) -->
        <input type="hidden" name="patient_id" value="<?php echo htmlspecialchars($_GET['patient_id']); ?>" />
        <input type="hidden" name="application_id" value="<?php echo htmlspecialchars($_GET['application_id']); ?>" />

        <!-- 보험사 선택 -->
        <div class="form-group dropdown">
          <label for="insurance" class="form-label">보험사</label>
          <div class="dropdown-container">
            <div class="dropdown-header" onclick="toggleDropdown()">
              <span id="dropdown-selected">보험사 선택</span>
              <input type="hidden" id="insurance" name="insurance" required />
              <span class="dropdown-arrow">▼</span>
            </div>
            <ul id="dropdown-list" class="dropdown-list hidden">
              <?php
              // DB 연결
              require_once __DIR__ . '/../../../config/dbconnection.php';

              // 보험사 리스트 불러오기
              $sql = "SELECT code, Insurance_list FROM Insurance";
              $result = $conn->query($sql);

              if ($result->num_rows > 0) {
                  while ($row = $result->fetch_assoc()) {
                      echo "<li class='dropdown-item' onclick=\"selectItem('{$row['Insurance_list']} ({$row['code']})', '{$row['code']}')\">{$row['Insurance_list']} ({$row['code']})</li>";
                  }
              } else {
                  echo "<li class='dropdown-item'>보험사 없음</li>";
              }
              ?>
            </ul>
          </div>
        </div>

        <!-- 접수 번호 입력 -->
        <div class="form-group">
          <label for="reference-number" class="form-label">접수 번호</label>
          <input type="text" id="reference-number" name="reference_number" class="form-input" placeholder="접수 번호를 입력해주세요" required />
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

  <script src="car-information.js"></script>
</body>
</html>
