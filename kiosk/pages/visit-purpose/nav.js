// 선택된 카드 상태를 저장
let selectedCard = null;

// 모든 카드에 클릭 이벤트 추가
const healthCard = document.getElementById('health');
const carCard = document.getElementById('car');
const etcCard = document.getElementById('etc');

[healthCard, carCard, etcCard].forEach((card) => {
  card.addEventListener('click', () => {
    // 기존 선택된 카드 스타일 초기화
    [healthCard, carCard, etcCard].forEach((c) =>
      c.classList.remove('selected')
    );

    // 선택된 카드 설정 및 스타일 적용
    card.classList.add('selected');
    selectedCard = card.id; // 선택된 카드 ID 저장
  });
});

// Next 버튼 동작
const nextPage = document.getElementById('next');
nextPage.addEventListener('click', () => {
  if (selectedCard === 'health') {
    window.location.href = '/kiosk/pages/complete-msg/complete-msg.php';
  } else if (selectedCard === 'car') {
    window.location.href = '/kiosk/pages/car-information/car-information.php';
  } else if (selectedCard === 'etc') {
    window.location.href = '/kiosk/pages/complete-msg/complete-msg.php';
  } else {
    alert('항목을 선택해주세요!');
  }
});

// 이전 버튼 동작
const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
  window.history.back();
});

