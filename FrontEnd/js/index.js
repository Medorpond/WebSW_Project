// index.js
let lastScrollY = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // 스크롤 다운: 헤더 숨김
        header.classList.add('hidden');
    } else {
        // 스크롤 업: 헤더 표시
        header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
});
