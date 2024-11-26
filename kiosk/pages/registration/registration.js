const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
  card.addEventListener('click', () => {
    // 다른 박스의 선택 상태 초기화
    cards.forEach((b) => b.classList.remove('selected'));

    // 클릭된 박스에 'selected' 클래스 추가
    card.classList.add('selected');
  });
});

const initialVisitCard = document.getElementById('initial-visit');
initialVisitCard.addEventListener('click', () => {

  window.location.href = '/kiosk/pages/privacy-consent/privacy-consent.html';
});

const followUpVisitCard = document.getElementById('follow-up-visit');
followUpVisitCard.addEventListener('click', () => {
  window.location.href = '/kiosk/pages/exist-information/exist-information.html';
});