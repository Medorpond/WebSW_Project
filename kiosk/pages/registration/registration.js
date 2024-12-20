document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
      card.addEventListener('click', () => {
          cards.forEach((b) => b.classList.remove('selected'));
          card.classList.add('selected');
      });
  });

  const initialVisitCard = document.getElementById('initial-visit');
  if (initialVisitCard) {
      initialVisitCard.addEventListener('click', () => {
          window.location.href = '/kiosk/pages/privacy-consent/privacy-consent.php';
      });
  }

  const followUpVisitCard = document.getElementById('follow-up-visit');
  if (followUpVisitCard) {
      followUpVisitCard.addEventListener('click', () => {
          window.location.href = '/kiosk/pages/exist-information/exist-information.php';
      });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const managerLogInBtn = document.getElementById('managerLogInBtn');
    const closePopupBtn = document.getElementById('closePopup');
  
    // 팝업 열기
    if (managerLogInBtn) {
      managerLogInBtn.addEventListener('click', popLoginPage);
    }
  
    // 팝업 닫기
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', closeLoginPage);
    }
  
    // 로그인 버튼 동작
    document.getElementById('loginButton').addEventListener('click', loginBtn);
  });
  
  // 팝업 열기 함수
  function popLoginPage() {
    const logInPopup = document.getElementById('logInPopup');
    logInPopup.classList.remove('hidden'); // 팝업 표시
    toggleBlur(true); // 블러 효과 추가
  }
  
  // 팝업 닫기 함수
  function closeLoginPage() {
    const logInPopup = document.getElementById('logInPopup');
    logInPopup.classList.add('hidden'); // 팝업 숨기기
    toggleBlur(false); // 블러 효과 제거
  }
  
  // 블러 효과 토글 함수
  function toggleBlur(state) {
    const elementsToBlur = document.querySelectorAll('.screen, .main-container');
    elementsToBlur.forEach((element) => {
      element.classList.toggle('blur', state);
    });
  }
  
  // 로그인 처리 함수
  function loginBtn(e) {
    e.preventDefault();
  
    const adminId = document.getElementById('adminId').value;
    const adminPassword = document.getElementById('adminPassword').value;
  
    fetch('/BackEnd/php/adminLogInHandler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId,
        adminPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('로그인 성공');
          closeLoginPage(); 
          window.location.href = '/FrontEnd/pages/home/index.html';
        } else {
          alert(data.message || '로그인 실패');
        }
      })
      .catch((error) => {
        console.error('로그인 처리 중 오류:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
      });
  }
  