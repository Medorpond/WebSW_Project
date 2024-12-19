document.addEventListener('DOMContentLoaded', initHome)

function initHome() {
    window.addEventListener('scroll', function() {
        const images = document.querySelectorAll('.promo-image');
        const promoText = document.getElementById('promoText');
        const promoTextContainer = document.querySelector('.promo-text');
        const footer = document.querySelector('footer');
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        images.forEach((image, index) => {
            const imageTop = image.offsetTop;
            const imageHeight = image.offsetHeight;

            if (scrollPosition > imageTop - windowHeight / 2 && scrollPosition < imageTop + imageHeight - windowHeight / 2) {
                promoText.innerText = `홍보 문구 ${index + 1}`;
                promoText.style.opacity = 0;
                setTimeout(() => {
                    promoText.style.opacity = 1;
                }, 300);
            }
        });

        const footerTop = footer.offsetTop;
        const promoTextHeight = promoTextContainer.offsetHeight;

        if (scrollPosition + windowHeight > footerTop - promoTextHeight) {
            promoTextContainer.style.position = 'absolute';
            promoTextContainer.style.top = `${footerTop - promoTextHeight - 20}px`;
        } else {
            promoTextContainer.style.position = 'fixed';
            promoTextContainer.style.top = '50%';
        }
    });
}


