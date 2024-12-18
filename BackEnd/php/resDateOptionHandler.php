<?php

// 세션 시작
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Content-Type 설정
header('Content-Type: application/json');

// 관리자 권한 확인
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    echo json_encode(['success' => false, 'message' => '관리자 권한이 없습니다.']);
    exit;
}

// POST 데이터 받기
$data = json_decode(file_get_contents('php://input'), true);

// 파일 경로 설정
$filePath = '/BackEnd/data/resDateOption.json';

// 파일 쓰기 권한 확인
if (!is_writable($filePath)) {
    echo json_encode(['success' => false, 'message' => '파일에 쓰기 권한이 없습니다.']);
    exit;
}

try {
    // 데이터를 JSON 형식으로 인코딩
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // 파일에 데이터 쓰기
    if (file_put_contents($filePath, $jsonData) === false) {
        throw new Exception('파일 쓰기 실패');
    }

    // 성공 응답
    echo json_encode(['success' => true, 'message' => '설정이 성공적으로 저장되었습니다.']);
} catch (Exception $e) {
    // 오류 응답
    echo json_encode(['success' => false, 'message' => '설정 저장 중 오류가 발생했습니다: ' . $e->getMessage()]);
}
