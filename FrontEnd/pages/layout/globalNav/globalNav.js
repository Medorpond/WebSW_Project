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
    document.getElementById('managerLogInBtn').addEventListener('click', popLoginPage)
    document.getElementById('closePopup').addEventListener('click', closeLoginPage)
    document.getElementById('loginButton').addEventListener('click', loginBtn)
}

function openSidebar(){
    document.getElementById('sidebar').classList.add('active');
    document.querySelector('header').classList.add('blur');
    document.querySelector('main').classList.add('blur');
    document.querySelector('footer').classList.add('blur');
}

function closeSidebar(){
    document.getElementById('sidebar').classList.remove('active');
    document.querySelector('header').classList.remove('blur');
    document.querySelector('main').classList.remove('blur');
    document.querySelector('footer').classList.remove('blur');

}

// 팝업 열기
function popLoginPage(){
    document.getElementById('logInPopup').classList.remove('hidden'); // 팝업 표시
    document.querySelector('header').classList.add('blur');
    document.querySelector('main').classList.add('blur');
    document.querySelector('footer').classList.add('blur');
}

// 팝업 닫기
function closeLoginPage() {
    document.getElementById('logInPopup').classList.add('hidden'); // 팝업 숨기기
    document.querySelector('header').classList.remove('blur');
    document.querySelector('main').classList.remove('blur');
    document.querySelector('footer').classList.remove('blur');
}

// 로그인 폼 처리
// function loginBtn(e) {
//     e.preventDefault(); // 기본 폼 제출 동작 방지
//     const id = document.getElementById('adminId').value;
//     const password = document.getElementById('adminPassword').value;
//
//     console.log('로그인 시도:', id, password);
//     alert('로그인 성공');
//     document.getElementById('logInPopup').classList.add('hidden'); // 팝업 숨기기
//     document.querySelector('header').classList.remove('blur');
//     document.querySelector('main').classList.remove('blur');
//     document.querySelector('footer').classList.remove('blur');
// }

function loginBtn(e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const password = document.getElementById('adminPassword').value;

    fetch('adminLogInHandler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            adminId: id,
            adminPassword: password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('로그인 성공');
                document.getElementById('logInPopup').classList.add('hidden'); // 팝업 숨기기
                document.querySelector('header').classList.remove('blur');
                document.querySelector('main').classList.remove('blur');
                document.querySelector('footer').classList.remove('blur');
                window.location.href = '/pages/home/index.html';
            } else {
                alert(data.message || '로그인 실패');
            }
        })
        .catch(error => {
            console.error('로그인 처리 중 오류 발생:', error);
            alert('로그인 처리 중 오류가 발생했습니다.');
        });
}


// 메뉴 동적 생성
function initNavMenu(){
    const mainMenuItems = [
        { name: "진료 예약", href: "/pages/reservation/reservation.html"},
        { name: "예약 확인", href: "/pages/reservationCheck/reservationCheck.html"}
    ];

    const subMenuItems = [
        { name: "FAQ", dataSection: "/pages/FAQ/FAQ.html"},
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
