<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>주소 입력</title>
  <link rel="stylesheet" href="/kiosk/globals.css">
  <link rel="stylesheet" href="/kiosk/styleguide.css">
  <link rel="stylesheet" href="address.css">
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</head>
<body>
<?php
// URL 파라미터 유효성 검증
if (!isset($_GET['patient_id']) || !ctype_digit($_GET['patient_id'])) {
    die("잘못된 접근입니다.");
}
$patient_id = intval($_GET['patient_id']);
?>

  <div class="screen">
    <div class="main-container">
      <!-- 안내 텍스트 -->
      <p class="centered-text">주소를 입력해주세요</p>

      <!-- 주소 입력 폼 시작 -->
      <form class="address-form" id="address-form" method="POST" action="process.php">
        <input type="hidden" name="patient_id" id="patient_id" value="<?php echo htmlspecialchars($_GET['patient_id']); ?>">

        <!-- 주소 입력 -->
        <div class="address-search">
          <input
            type="text"
            name="full_address"
            id="address-input"
            class="address-input"
            placeholder="주소를 검색하세요"
            onclick="openAddressPopup()"
            readonly
            required
          />
          <img
            src="/kiosk/assets/img/search.png"
            alt="Search Icon"
            class="search-icon"
            onclick="openAddressPopup()"
          />
        </div>

        <!-- 상세 주소 입력 -->
        <div class="address-details">
          <input
            type="text"
            id="sido-input"
            class="address-input"
            placeholder="시/도 (자동입력)"
            readonly
          />
          <input
            type="text"
            id="sigungu-input"
            class="address-input"
            placeholder="시/군/구 (자동입력)"
            readonly
          />
          <input
            type="text"
            id="bname-input"
            class="address-input"
            placeholder="읍/면/동 (자동입력)"
            readonly
          />
          <input
            type="text"
            name="detail_address"
            id="buildingname-input"
            class="address-input"
            placeholder="상세주소 (수정가능)"
            required
          />
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
          <button type="submit" class="nav-button next" id="next">
            <img
              class="nav-icon"
              src="/kiosk/assets/img/nextbutton.png"
              alt="Next"
            />
          </button>
        </div>
      </form>
    </div>

    <div class="header">
      <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
    </div>
  </div>
  <script src="address.js"></script>
  <script src="nav.js"></script>
</body>
</html>
