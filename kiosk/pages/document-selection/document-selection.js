const boxes = document.querySelectorAll('.box');

boxes.forEach((box) => {
  box.addEventListener('click', () => {
    // 클릭된 박스의 'selected' 상태를 토글
    box.classList.toggle('selected');
  });
});
