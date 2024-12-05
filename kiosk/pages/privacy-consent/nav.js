const agreeBoxes = document.querySelectorAll('.agree-box');

agreeBoxes.forEach((agreeBox) => {
  agreeBox.addEventListener('click', () => {
    agreeBox.classList.toggle('selected'); // 'selected' 클래스 토글
    console.log(agreeBox.classList); // 디버깅용
  });
});

// "다음" 버튼 클릭 이벤트
const nextPage = document.getElementById('next');
const signatureCanvas = document.getElementById('signatureCanvas');

function isCanvasSigned(canvas) {
  const context = canvas.getContext('2d');
  const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;

  // 캔버스에 내용이 있으면 true 반환
  return pixelData.some((pixel) => pixel !== 0);
}

nextPage.addEventListener('click', () => {
  const isAgreed = Array.from(agreeBoxes).some((box) =>
    box.classList.contains('selected')
  ); // 선택된 동의함 박스 확인
  const isSigned = isCanvasSigned(signatureCanvas);

  if (!isAgreed) {
    alert('개인정보 수집 및 이용에 동의해주세요.');
    return;
  }

  if (!isSigned) {
    alert('서명란에 서명을 완료해주세요.');
    return;
  }

  // 페이지 이동
  window.location.href = '/kiosk/pages/information-form/information-form.php';
});


// "이전" 버튼 클릭 이벤트
const previousPage = document.getElementById('previous');
previousPage.addEventListener('click', () => {
  window.history.back();
});
