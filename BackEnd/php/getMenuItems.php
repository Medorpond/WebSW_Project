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
        ['name' => '예약 정보 수정', 'href' => '/FrontEnd/pages/reservationManage/reservationManage.html'],
        ['name' => '예약 현황 확인', 'href' => '#']
    ];
    $menuItems['sub'] = [
        ['name' => 'FAQ', 'href' => '/FrontEnd/pages/FAQ/FAQ.html'],
        ['name' => 'KIOSK', 'href' => '/kiosk/visit-purpose/여기에 키오스크 연결']
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
