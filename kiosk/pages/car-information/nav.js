// 네비게이션 버튼
const nextPage = document.getElementById('next');
nextPage.addEventListener('click', () => {
  window.location.href = '/kiosk/pages/car-form/car-form.html';
});

const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
    window.history.back();
});