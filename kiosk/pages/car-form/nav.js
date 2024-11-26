// 네비게이션 버튼
const nextPage = document.getElementById('next');
nextPage.addEventListener('click', () => {
  window.location.href = '/kiosk/pages/complete-msg/complete-msg.html';
});

const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
    window.history.back();
});