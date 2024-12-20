// 선택된 카드 저장
let selectedCard = null;

// 카드 선택 동작
const cards = document.querySelectorAll('.card');
const selectedPurposeInput = document.getElementById('selected-purpose');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    // 이전 선택 초기화
    cards.forEach((c) => c.classList.remove('selected'));

    // 선택 상태 반영
    card.classList.add('selected');
    selectedCard = card.dataset.value; // 선택된 카드 값 저장
    selectedPurposeInput.value = selectedCard; // 폼에 선택된 값 설정
  });
});

// 이전 버튼
const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
  window.history.back();
});
