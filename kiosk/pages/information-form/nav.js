const nextPage = document.getElementById('next');
const previousPage = document.getElementById('previous');

// "다음" 버튼 클릭 이벤트
nextPage.addEventListener('click', () => {
  const nameInput = document.getElementById('name');
  const idFrontInput = document.getElementById('id-number');
  const idBackInput = document.querySelector('.id-container .form-input.short:nth-child(3)');
  const phoneInput = document.getElementById('phone');

  // 입력란이 비어 있는지 확인
  if (!nameInput.value.trim()) {
    alert('이름을 입력해주세요.');
    nameInput.focus();
    return;
  }

  if (!idFrontInput.value.trim() || idFrontInput.value.length !== 6) {
    alert('주민번호 앞 6자리를 정확히 입력해주세요.');
    idFrontInput.focus();
    return;
  }

  if (!idBackInput.value.trim() || idBackInput.value.length !== 7) {
    alert('주민번호 뒤 7자리를 정확히 입력해주세요.');
    idBackInput.focus();
    return;
  }

  if (!phoneInput.value.trim() || !/^\d{10,11}$/.test(phoneInput.value)) {
    alert('유효한 전화번호를 입력해주세요.');
    phoneInput.focus();
    return;
  }

  // 모든 입력란이 올바르게 채워진 경우 페이지 이동
  window.location.href = '/kiosk/pages/address/address.html';
});

// "이전" 버튼 클릭 이벤트
previousPage.addEventListener('click', () => {
  window.history.back();
});
