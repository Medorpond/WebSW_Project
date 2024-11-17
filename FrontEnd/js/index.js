let content = null;

document.addEventListener("DOMContentLoaded", onDOMLoad);


// DOM 로드 함수
function onDOMLoad(){
    content = document.getElementById("content");

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