let content = null;

document.addEventListener("DOMContentLoaded", onDOMLoad);


// DOM 초기화 함수
function onDOMLoad(){
    content = document.getElementById("content");

    // 네비게이션 메뉴 동적 생성
    initNavMenu();

    // 리스너 장착, url 부여
    const navs = document.querySelectorAll("a[data-section]")

    navs.forEach(nav => {
        nav.addEventListener("click", (event) => {
            event.preventDefault(); // 링크의 기본 동작(페이지 이동) 막기
            const url = nav.getAttribute("data-section"); // URL 가져오기
            loadPage(url); // 페이지 로드 함수 호출
        });
    });
}

function initNavMenu(){
    const mainMenuItems = [
        { name: "Main Nav 01", dataSection: "subpage"},
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
}











// Subpage 로드 함수
function loadPage(pageName) {
     const contentHtml = "./components/" + pageName + ".html";
     const contentCss = "./css/" + pageName + ".css";
     const contentJs = "./js/" + pageName + ".js";

     loadHTML(contentHtml);
     loadStyleSheet(contentCss);
     loadScript(contentJs)
}

function loadHTML(url){
    fetch(url)
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
        });
}

function loadStyleSheet(url){
    const subpageCss = document.getElementById("subpage-css");
    if(subpageCss){
        subpageCss.href = url;
    }
}

function loadScript(url){
    const subpageJs = document.getElementById("subpage-js");
    if(subpageJs){
        subpageJs.src = url;
    }
}