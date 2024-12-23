<?php
/** @var mysqli $conn */
require_once __DIR__ . '/../../config/dbconnection.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

// POST 데이터 받기
$data = json_decode(file_get_contents('php://input'), true);
$adminId = isset($data['adminId']) ? $data['adminId'] : '';
$adminPassword = isset($data['adminPassword']) ? $data['adminPassword'] : '';

// 입력값 검증
if (empty($adminId) || empty($adminPassword)) {
    echo json_encode(['success' => false, 'message' => '아이디와 비밀번호를 모두 입력해주세요.']);
    exit;
}

try {
    // 관리자 정보 조회
    $stmt = $conn->prepare("SELECT id, password FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $adminId);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    if ($admin && password_verify($adminPassword, $admin['password'])) {
        // 로그인 성공
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        echo json_encode(['success' => true]);
    } else {
        // 로그인 실패
        echo json_encode(['success' => false, 'message' => '아이디 또는 비밀번호가 일치하지 않습니다.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '로그인 처리 중 오류가 발생했습니다.']);
}

// 연결 종료
$conn->close();
