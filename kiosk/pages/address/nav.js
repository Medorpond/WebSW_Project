const nextPage = document.getElementById('next');
const previousPage = document.getElementById('previous');

nextPage.addEventListener('click', () => {
  const addressInput = document.getElementById('address-input');

  // 입력란이 비어 있는지 확인
  if (!addressInput.value.trim()) {
    alert('주소를 검색해주세요');
    addressInput.focus();
    return;
  }

  // 모든 입력란이 올바르게 채워진 경우 페이지 이동
  window.location.href = '/kiosk/pages/document-selection/document-selection.php';
});

// "이전" 버튼 클릭 이벤트
previousPage.addEventListener('click', () => {
  window.history.back();
});
