document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.promo-image');
    const promoText = document.getElementById('promoText');
    const promoTextContainer = document.querySelector('.promo-text');
    const footer = document.querySelector('footer');
    const transitionInterval = 5000; // 5초마다 전환

    const promoTexts = [
        "정성을 담은 진료로 여는 건강한 내일",
        "한방의 향기로 채우는 건강한 몸",
        "건강한 삶으로 이어가는 가족의 행복"
    ];

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
        });
        images[index].classList.add('active');
        promoText.innerText = promoTexts[index];  // 각 이미지에 맞는 홍보 문구 표시
        promoText.style.opacity = 0;
        setTimeout(() => {
            promoText.style.opacity = 1;
        }, 250);
    }


    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    }

    function checkFooterPosition() {
        const windowHeight = window.innerHeight;
        const footerTop = footer.offsetTop;
        const promoTextHeight = promoTextContainer.offsetHeight;

        if (windowHeight > footerTop - promoTextHeight) {
            promoTextContainer.style.position = 'absolute';
            promoTextContainer.style.top = `${footerTop - promoTextHeight - 20}px`;
        } else {
            promoTextContainer.style.position = 'fixed';
            promoTextContainer.style.top = '50%';
            promoTextContainer.style.transform = 'translate(-50%, -50%)';
        }
    }

    // 자동 이미지 전환 시작
    setInterval(nextImage, transitionInterval);

    window.addEventListener('resize', checkFooterPosition);

    showImage(currentImageIndex);
    checkFooterPosition();
});
