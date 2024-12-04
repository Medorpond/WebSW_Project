document.addEventListener('DOMContentLoaded', initHome)


function initHome() {
    const imageContainer = document.querySelector("main") ;
    const imagePaths = [
        '/assets/imgs/ricky.jpg']

    // 이미지 동적 생성
    imagePaths.forEach((path, index) => {
        const img = document.createElement('img');
        img.className = 'image-section';
        img.src = `${path}`;
        imageContainer.appendChild(img);
    })
}