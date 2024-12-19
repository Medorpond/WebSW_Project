<?php
require_once __DIR__ . '/../../config/dbconnection.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 오류 표시 설정
ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => '권한이 없습니다']);
    exit;
}

try {
    $year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
    $month = isset($_GET['month']) ? (int)$_GET['month'] : date('m');

    $query = "SELECT
                reservation_id,
                patient_id,
                time,
                created_at,
                name,
                updated_at
              FROM Reservation
              WHERE YEAR(time) = ? AND MONTH(time) = ?
              ORDER BY time ASC, created_at ASC";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("쿼리 준비 실패: " . $conn->error);
    }

    $stmt->bind_param("ii", $year, $month);

    if (!$stmt->execute()) {
        throw new Exception("쿼리 실행 실패: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $reservations = [];

    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => true, 'data' => $reservations]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
