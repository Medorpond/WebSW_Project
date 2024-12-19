<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$isAdmin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;

$menuItems = [
    'main' => [],
    'sub' => []
];

if ($isAdmin) {
    $menuItems['main'] = [
        ['name' => 'KIOSK', 'href' => '/kiosk/pages/registration/registration.php'],
        ['name' => '예약 현황', 'href' => '/FrontEnd/pages/reservationOverview/reservationOverview.html'],
        ['name' => '대기열', 'href' => '/kiosk/pages/desk/desk.php'],
        ['name' => '환자 호출', 'href' => '/kiosk/pages/admin/call.php']
    ];
    $menuItems['sub'] = [
        ['name' => '예약정보수정', 'href' => '/FrontEnd/pages/reservationManage/reservationManage.html'],
        ['name' => 'KIOSK 수정', 'href' => '#'],
        ['name' => 'FAQ', 'href' => '/FrontEnd/pages/FAQ/FAQ.html']
    ];
} else {
    $menuItems['main'] = [
        ['name' => '진료 예약', 'href' => '/FrontEnd/pages/reservation/reservation.html'],
        ['name' => '예약 확인', 'href' => '/FrontEnd/pages/reservationCheck/reservationCheck.html']
    ];
    $menuItems['sub'] = [
        ['name' => 'FAQ', 'href' => '/FrontEnd/pages/FAQ/FAQ.html']
    ];
}

header('Content-Type: application/json');
echo json_encode($menuItems);
