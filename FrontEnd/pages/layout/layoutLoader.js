async function initLayout() {
    try {
        // 병렬로 layout component 로드
        await Promise.all([
            fetch('/pages/layout/globalNav/globalNav.html')
                .then(res => res.text()) // HTML 로드
                .then(html => {
                    // DOM 에 HTML 삽입
                    document.querySelector('header').innerHTML = html;

                })
                .then(() => {
                    // JavaScript 로드
                    loadScript('/pages/layout/globalNav/globalNav.js');
                    // 초기화 함수 호출 (option)
                    if (typeof onDOMLoad === 'function') {
                        onDOMLoad();
                    }
                }),

            fetch('/pages/layout/footer/footer.html')
                .then(res => res.text()) // HTML 로드
                .then(html => {
                    // DOM에 HTML 삽입
                    document.querySelector('footer').innerHTML = html;
                })
        ]);

        // CSS 병렬 로드
        await Promise.all([
            loadCSS('/pages/layout/globalNav/globalNav.css'),
            loadCSS('/pages/layout/footer/footer.css')
        ]);

    } catch (error) {
        console.error('Error loading layout components:', error);
    }
}

// Layout 로더 (HTML, JS 로드)
async function loadLayout(htmlUrl, targetSelector, scriptUrl) {
    try {
        const res = await fetch(htmlUrl);

        // HTTP 상태 코드 확인
        if (!res.ok) {
            throw new Error(`Failed to fetch ${htmlUrl}: ${res.status} ${res.statusText}`);
        }

        const html = await res.text();
        document.querySelector(targetSelector).innerHTML = html;

        // JavaScript 로드 (옵션)
        if (scriptUrl) {
            await loadScript(scriptUrl);
        }
    } catch (error) {
        console.error(`Error loading layout (${htmlUrl}):`, error);
        // 실패를 허용하려면 예외를 다시 던지지 않음.
    }
}

// CSS 파일 로더
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
        document.head.appendChild(link);
    });
}

// JavaScript 파일 로더
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve; // 스크립트 로드 완료
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

// DOMContentLoaded 이벤트 후 로드 시작
document.addEventListener('DOMContentLoaded', initLayout);
