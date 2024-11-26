const nextPage = document.getElementById('next');
const previousPage = document.getElementById('previous');

nextPage.addEventListener('click', () => {
  const isChecked = Array.from(boxes).some((box) =>
    box.classList.contains('selected')
  ); // 선택된 동의함 박스 확인

  if (!isChecked) {
    alert('항목을 선택해주세요.');
    return;
  }

  // 페이지 이동
  window.location.href = '/kiosk/pages/visit-purpose/visit-purpose.html';
});

previousPage.addEventListener('click', () => {
  window.history.back();
});
