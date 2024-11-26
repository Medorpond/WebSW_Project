// 사용자 이름 설정
const userName = "김대운";
document.getElementById("user-name").textContent = userName;


// 카운트다운 로직
const countdownElement = document.getElementById('countdown');
let countdown = 5;

const interval = setInterval(() => {
  countdown -= 1;
  countdownElement.textContent = countdown; 

  if (countdown === 0) {
    clearInterval(interval); // 카운트다운 종료
    window.location.href = '/kiosk/pages/registration/registration.html'; 
  }
}, 1000); // 1초 간격