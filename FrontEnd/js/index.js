let content = null;

document.addEventListener("DOMContentLoaded", onDOMLoad);


// DOM 초기화 함수
function onDOMLoad(){
    // content 영역 설정
    content = document.getElementById("content");

    // 네비게이션 메뉴 동적 생성 및 초기화
    initNavMenu();

    //버튼 이벤트 초기화
    initBtn();

    // SPA 뒤로가기, 앞으로가기 기능 추가
    window.onpopstate = function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    };
}

// 버튼 동작 이벤트 추가 함수
function initBtn(){
    document.getElementById('openSidebarBtn').addEventListener('click', openSidebar)
    document.getElementById('closeSidebarBtn').addEventListener('click', closeSidebar)
}

function openSidebar(){
    document.getElementById('sidebar').classList.add('active');
    document.getElementById('pageContent').classList.add('blur');
}

function closeSidebar(){
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('pageContent').classList.remove('blur');
}

// 메뉴 동적 생성
function initNavMenu(){
    const mainMenuItems = [
        { name: "Main Nav 01", dataSection: "reservation"},
        { name: "Main Nav 02", dataSection: "subpage"},
        { name: "Main Nav 03", dataSection: "subpage"},
        { name: "Main Nav 04", dataSection: "subpage"}
    ];

    const subMenuItems = [
        { name: "Sub Nav 01", dataSection: "subpage"},
        { name: "Sub Nav 02", dataSection: "subpage"}
    ];

    const mainNavMenu = document.getElementById("mainMenu");
    const subNavMenu = document.getElementById("subMenu");
    const sidebar_Main = document.getElementById("sidebarMain");
    const sidebar_Sub = document.getElementById("sidebarSub");

    // 메뉴 항목 생성 함수
    const createMenuItems = (parentElement, menuItems) => {
        menuItems.forEach((item) => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = "#";
            a.textContent = item.name;
            a.dataset.section = item.dataSection;
            li.appendChild(a);
            parentElement.appendChild(li);
        });
    };

    createMenuItems(mainNavMenu, mainMenuItems);
    createMenuItems(subNavMenu, subMenuItems);
    createMenuItems(sidebar_Main, mainMenuItems);
    createMenuItems(sidebar_Sub, subMenuItems);

    // 생성된 메뉴에 리스너 장착, url 부여
    const navs = document.querySelectorAll("a[data-section]")

    navs.forEach(nav => {
        nav.addEventListener("click", (event) => {
            event.preventDefault(); // 링크의 기본 동작(페이지 이동) 막기
            const url = nav.getAttribute("data-section"); // URL 가져오기
            loadPage(url); // 페이지 로드 함수 호출
        });
    });
}

// Subpage 로드 함수
function loadPage(pageName) {
     const contentHtml = "./components/" + pageName + ".html";
     const contentCss = "./css/" + pageName + ".css";
     const contentJs = "./js/" + pageName + ".js";

     loadHTML(contentHtml)
        .then(()=> {
            loadStyleSheet(contentCss);
            loadScript(contentJs);
        })// 명시적으로 DOM 로드 후 js 로드
        .catch((error) =>{
            console.error("페이지 로드 실패: ", error);
        })
    
    // URL과 히스토리 업데이트
    history.pushState({page: pageName}, pageName, `#${pageName}`)
}

function loadHTML(url){
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("네트워크 응답에 문제가 있습니다.");
            }
            return response.text();
        })
        .then((html) => {
            content.innerHTML = html; // HTML 콘텐츠를 SPA 영역에 로드
        })
        .catch((error) => {
            console.error("페이지 로드 실패:", error);
            content.innerHTML = "<p>페이지 로드에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>";
        });
}

function loadStyleSheet(url){
    const subpageCss = document.getElementById("subpage-css");
    if(subpageCss){
        subpageCss.href = url;
    }
}

function loadScript(url){
    return new Promise((resolve, reject) => {
        // 기존 subpage-js 삭제
        const existingScript = document.getElementById("subpage-js");
        if (existingScript) {
            existingScript.remove(); // 기존 스크립트를 DOM에서 제거
        }

        // library 삭제
        const libraryScripts = document.querySelectorAll("script.lib");
        libraryScripts.forEach((script) => {
            script.remove(); // library 스크립트 제거
        });

        // 새 script 태그 생성
        const script = document.createElement('script');
        script.src = url;
        script.async = false; // 스크립트가 로드된 후 바로 실행되도록 설정
        script.defer = true; // HTML 파싱 이후 실행되도록 설정
        script.id = "subpage-js"; // 동일한 ID 설정
        script.onload = () => {
            console.log(`Script loaded and executed: ${url}`);
            resolve();
        };
        script.onerror = () => {
            reject(new Error(`Failed to load script: ${url}`));
        };

        // <head>에 새 script 태그 추가
        document.head.appendChild(script);
    });
}

function loadLibrary(url){
    return new Promise((resolve, reject) => {
            // 라이브러리가 이미 로드되었는지 확인
            const existingLibrary = Array.from(document.querySelectorAll("script.lib"))
                .find(script => script.src === url);
            if (existingLibrary) {
                console.log(`Library already loaded: ${url}`);
                resolve();
                return;
            }

            // 새 script 태그 생성
            const script = document.createElement("script");
            script.src = url;
            script.async = false; // 동기 로드
            script.defer = true; // HTML 파싱 후 실행
            script.classList.add("lib");
            script.onload = () => {
                console.log(`Library loaded and executed: ${url}`);
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Failed to load library: ${url}`));
            };

            // <head>에 script 추가
            document.head.appendChild(script);
        });
}