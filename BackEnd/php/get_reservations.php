<?php
require_once 'db_connect.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(403);
    echo json_encode(['error' => '권한이 없습니다']);
    exit;
}

function getReservations($conn, $year, $month) {
    $query = "SELECT 
                r.reservation_id,
                r.patient_id,
                r.time,
                r.created_at,
                r.name,
                r.updated_at
              FROM Reservation r
              WHERE YEAR(time) = ? AND MONTH(time) = ?
              ORDER BY time ASC, created_at ASC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $year, $month);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

try {
    $year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
    $month = isset($_GET['month']) ? (int)$_GET['month'] : date('m');

    $reservations = getReservations($conn, $year, $month);
    echo json_encode(['success' => true, 'data' => $reservations]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
