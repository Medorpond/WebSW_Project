const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기 설정
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 그림 시작
function startDrawing(event) {
  isDrawing = true;
  const { x, y } = getCursorPosition(event);
  lastX = x;
  lastY = y;
}

// 그림 그리기
function draw(event) {
  if (!isDrawing) return;

  const { x, y } = getCursorPosition(event);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#000000"; // 검은색 선
  ctx.lineWidth = 2; // 선 굵기
  ctx.lineCap = "round"; // 선 끝 모양
  ctx.lineJoin = "round"; // 선 연결 모양
  ctx.stroke();
  lastX = x;
  lastY = y;
}

// 그림 끝
function stopDrawing() {
  isDrawing = false;
  ctx.beginPath(); // 경로 초기화
}

// 좌표 얻기
function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x =
    (event.clientX || event.touches?.[0]?.clientX || 0) - rect.left;
  const y =
    (event.clientY || event.touches?.[0]?.clientY || 0) - rect.top;
  return { x, y };
}

// 캔버스 초기화
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 이벤트 리스너 등록
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// 터치 지원
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
