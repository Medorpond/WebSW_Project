document.addEventListener('DOMContentLoaded', initHome)

function initHome() {
    const imageContainer = document.querySelector(".slider") ;
    const imagePaths = [
        '/assets/imgs/ricky.jpg',
        '/assets/imgs/icon.png',
        '/assets/imgs/ricky.jpg',
        '/assets/imgs/icon.png',
        '/assets/imgs/ricky.jpg',
        '/assets/imgs/icon.png']

    // 이미지 동적 생성
    imagePaths.forEach((path, index) => {
        const img = document.createElement('img');
        img.className = 'image-section';
        img.src = `${path}`;
        imageContainer.appendChild(img);
    })

    let currentIndex = 0;
    const slider = document.querySelector('.slider');
    const slides = slider.querySelectorAll('img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');

    // 도트 생성
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;
      dots[currentIndex].classList.remove('active');
      dots[index].classList.add('active');
      currentIndex = index;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(slides.length - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    });

    // 자동 슬라이드 (선택사항)
    setInterval(() => {
      if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    }, 5000); // 5초마다 다음 슬라이드로 이동
}


