<?php
/** @var mysqli $conn */
require_once __DIR__ . '/../../config/dbconnection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$selectedDate = isset($data['date']) ? $data['date'] : '';
$selectedTime = isset($data['time']) ? $data['time'] : '';

if (empty($selectedDate) || empty($selectedTime)) {
    echo json_encode([
        'success' => false,
        'message' => '날짜와 시간 정보가 필요합니다.'
    ]);
    exit;
}

try {
    // 선택된 시간의 전후 30분 범위 예약 수 확인
    $selectedDateTime = "$selectedDate $selectedTime:00";
    $timeBeforeThirty = date('Y-m-d H:i:s', strtotime("$selectedDateTime -30 minutes"));
    $timeAfterThirty = date('Y-m-d H:i:s', strtotime("$selectedDateTime +30 minutes"));


    // 이전 30분부터 선택 시간까지의 예약 수 확인
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Reservation WHERE time BETWEEN ? AND ?");
    $stmt->bind_param("ss", $timeBeforeThirty, $selectedDateTime);
    $stmt->execute();
    $result = $stmt->get_result();
    $countBefore = $result->fetch_row()[0];

    // 선택 시간부터 이후 30분까지의 예약 수 확인
    $stmt = $conn->prepare("SELECT COUNT(*) FROM Reservation WHERE time BETWEEN ? AND ?");
    $stmt->bind_param("ss", $selectedDateTime, $timeAfterThirty);
    $stmt->execute();
    $result = $stmt->get_result();
    $countAfter = $result->fetch_row()[0];

    // 두 구간 중 하나라도 3명 이상이면 예약 불가
    $isAvailable = $countBefore < 3 && $countAfter < 3;

    echo json_encode([
        'success' => true,
        'isAvailable' => $isAvailable
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '시간 확인 중 오류가 발생했습니다.'
    ]);
}

$conn->close();
