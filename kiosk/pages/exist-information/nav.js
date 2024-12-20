// 네비게이션 버튼
const nextPage = document.getElementById('next');
nextPage.addEventListener('click', () => {
  window.location.href = '/kiosk/pages/confirmation/confirmation.php';
});

const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
    window.history.back();
});