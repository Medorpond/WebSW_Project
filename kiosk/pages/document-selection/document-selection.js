const boxes = document.querySelectorAll('.box');
const selectedDocumentsInput = document.getElementById('selected-documents');
const form = document.getElementById("document-form");

function updateSelectedDocuments() {
  const selectedValues = Array.from(boxes)
    .filter((b) => b.classList.contains('selected'))
    .map((b) => b.dataset.value);

  // JSON 변환 및 값 설정
  const jsonString = JSON.stringify(selectedValues).trim();
  selectedDocumentsInput.value = jsonString;

  // 디버깅 로그
  console.log("전송될 문서 값:", jsonString);
}

boxes.forEach((box) => {
  box.addEventListener('click', () => {
    const value = box.dataset.value;

    // "필요없음" 선택 시 초기화
    if (value === "0") {
      boxes.forEach((b) => b.classList.remove('selected'));
      box.classList.add('selected');
    } else {
      const noneBox = document.querySelector('.box[data-value="0"]');
      noneBox.classList.remove('selected');
      box.classList.toggle('selected');
    }

    updateSelectedDocuments(); // 선택 업데이트
  });
});

// 폼 제출 시 확인
form.addEventListener('submit', (event) => {
  updateSelectedDocuments(); // 폼 제출 전에 값 강제 업데이트

  if (!selectedDocumentsInput.value || selectedDocumentsInput.value === "[]") {
    alert("하나 이상의 문서를 선택하세요.");
    event.preventDefault(); // 제출 방지
  }
});
