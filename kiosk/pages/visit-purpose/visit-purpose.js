const agreebt = document.querySelectorAll('.card');

agreebt.forEach((agreebutton) => {
    agreebutton.addEventListener('click', () => {
        // 모든 버튼의 선택 상태 초기화
        agreebt.forEach((button) => button.classList.remove('selected'));
        
        // 클릭한 버튼만 선택
        agreebutton.classList.add('selected');
    });
});