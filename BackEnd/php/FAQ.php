<?php
require_once 'BackEnd/php/generalFunction.php';

$pdo = getPdo();
header('Content-Type: application/json');

// 관리자 권한 확인
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

// GET 요청 처리 (FAQ 목록 조회)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT faq_id, title, content, created_at, updated_at FROM FAQ ORDER BY created_at DESC");
        $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'faqs' => $faqs,
            'isAdmin' => isAdmin()
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'FAQ 조회 중 오류가 발생했습니다.']);
    }
}

// PUT 요청 처리 (FAQ 수정)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => '권한이 없습니다.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['faq_id']) || !isset($data['title']) || !isset($data['content'])) {
        echo json_encode(['success' => false, 'message' => '필수 데이터가 누락되었습니다.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE FAQ SET title = :title, content = :content, updated_at = NOW() WHERE faq_id = :faq_id");
        $stmt->execute([
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':faq_id' => $data['faq_id']
        ]);

        echo json_encode(['success' => true, 'message' => 'FAQ가 수정되었습니다.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'FAQ 수정 중 오류가 발생했습니다.']);
    }
}

// DELETE 요청 처리 (FAQ 삭제)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => '권한이 없습니다.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['faq_id'])) {
        echo json_encode(['success' => false, 'message' => 'FAQ ID가 필요합니다.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM FAQ WHERE faq_id = :faq_id");
        $stmt->execute([':faq_id' => $data['faq_id']]);

        echo json_encode(['success' => true, 'message' => 'FAQ가 삭제되었습니다.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'FAQ 삭제 중 오류가 발생했습니다.']);
    }
}
