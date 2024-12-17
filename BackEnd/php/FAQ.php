<?php
session_start();

// 관리자 권한 확인
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

// GET 요청 처리 (FAQ 목록 조회)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $faqs = [
        /* DB에서 FAQ 목록 조회 */
    ];
    echo json_encode([
        'faqs' => $faqs,
        'isAdmin' => isAdmin()
    ]);
}

// PUT 요청 처리 (FAQ 수정)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!isAdmin()) {
        http_response_code(403);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    /* DB 업데이트 로직 */

    echo json_encode(['success' => true]);
}

// DELETE 요청 처리 (FAQ 삭제)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isAdmin()) {
        http_response_code(403);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    /* DB 삭제 로직 */

    echo json_encode(['success' => true]);
}
?>
