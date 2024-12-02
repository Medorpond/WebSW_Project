// document.addEventListener("DOMContentLoaded", onDOMLoad);
// onDOMLoad();
// DOM 초기화 함수
function onDOMLoad(){
    // 네비게이션 메뉴 동적 생성 및 초기화
    initNavMenu();

    //버튼 이벤트 초기화
    initBtn();
}

// 버튼 동작 이벤트 추가 함수
function initBtn(){
    document.getElementById('openSidebarBtn').addEventListener('click', openSidebar)
    document.getElementById('closeSidebarBtn').addEventListener('click', closeSidebar)
}

function openSidebar(){
    document.getElementById('sidebar').classList.add('active');
    //document.getElementById('pageContent').classList.add('blur');
}

function closeSidebar(){
    document.getElementById('sidebar').classList.remove('active');
    //document.getElementById('pageContent').classList.remove('blur');
}

// 메뉴 동적 생성
function initNavMenu(){
    const mainMenuItems = [
        { name: "예약하기", href: "/pages/reservation/reservation.html"},
        { name: "Main Nav 02", href: "/pages/subpage/subpage.html"},
        { name: "Main Nav 03", href: "/pages/subpage/subpage.html"},
        { name: "Main Nav 04", href: "/pages/subpage/subpage.html"}
    ];

    const subMenuItems = [
        { name: "Sub Nav 01", dataSection: "/pages/subpage/subpage.html"},
        { name: "Sub Nav 02", dataSection: "/pages/subpage/subpage.html"}
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

            a.href = item.href;
            a.textContent = item.name;
            li.appendChild(a);
            parentElement.appendChild(li);
        });
    };

    createMenuItems(mainNavMenu, mainMenuItems);
    createMenuItems(subNavMenu, subMenuItems);
    createMenuItems(sidebar_Main, mainMenuItems);
    createMenuItems(sidebar_Sub, subMenuItems);
}
