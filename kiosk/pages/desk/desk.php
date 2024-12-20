<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/kiosk/globals.css" />
  <link rel="stylesheet" href="/kiosk/styleguide.css" />
  <link rel="stylesheet" href="desk.css" />
  <title>대기 환자 호출 화면</title>
</head>
<body>
  <div class="container">
    <!-- 왼쪽 섹션 -->
    <div class="left-section">
      <div class="logo-container">
        <div id="logIn">
            <button id="managerLogInBtn">
                <img src="/kiosk/assets/img/logo.png" alt="대운한의원 로고" class="logo" />
            </button>
        </div>
      </div>
      <div class="waiting-title">대기 환자</div>
      <ul id="waiting-patient-list" class="patient-list"></ul>
    </div>

    <!-- 오른쪽 섹션 -->
    <div class="right-section">
      <div class="call-text">진료실로 들어와주세요.</div>
      <ul id="called-patient-list" class="patient-called-list"></ul>
    </div>
  </div>
  <!-- 관리자 로그인 팝업 -->
  <div id="logInPopup" class="hidden">
        <div class="popup-content">
            <button id="closePopup">&times;</button>
            <h2>관리자 로그인</h2>
            <form id="loginForm">
                <label for="adminId">관리자 ID:</label>
                <input type="text" id="adminId" name="adminId" placeholder="아이디 입력" required />

                <label for="adminPassword">비밀번호:</label>
                <input type="password" id="adminPassword" name="adminPassword" placeholder="비밀번호 입력" required />
            </form>
            <button type="submit" id="loginButton">로그인</button>
        </div>
    </div>
    
  <script>
    // 대기 환자 목록 및 호출 업데이트
    async function fetchPatients() {
      try {
        const response = await fetch("process.php");
        const data = await response.json();

        if (data.status === "success") {
          const waitingList = document.getElementById("waiting-patient-list");
          const calledList = document.getElementById("called-patient-list");

          // 기존 리스트 초기화
          waitingList.innerHTML = "";
          calledList.innerHTML = "";

          // 대기 환자와 호출된 환자 목록 갱신
          data.data.forEach((patient) => {
            const listItem = document.createElement("li");
            listItem.className = `patient-item`;
            listItem.textContent = `${patient.name} (${patient.birth_year})`;

            if (patient.call === "0") {
              waitingList.appendChild(listItem);  // 대기 환자
            } else if (patient.call === "1") {
              calledList.appendChild(listItem);   // 호출된 환자
            }
          });
        } else {
          console.error("데이터 로드 오류:", data.message);
        }
      } catch (error) {
        console.error("서버 오류:", error);
      }
    }

    // 5초마다 대기 목록 갱신
    setInterval(fetchPatients, 5000);
    fetchPatients(); // 초기 실행
  </script>
  <script src="desk.js"></script>
</body>
</html>
