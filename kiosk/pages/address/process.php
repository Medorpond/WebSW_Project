<?php
// PHP 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB 연결
require_once __DIR__ . '/../../../config/dbconnection.php';

// 폼 데이터 받기
$patient_id = intval($_POST['patient_id']);
$full_address = trim($_POST['full_address']);
$detail_address = trim($_POST['detail_address']);
$address = $full_address . ' ' . $detail_address;

// 데이터 검증
if (empty($patient_id) || empty($address)) {
    die("주소 입력이 올바르지 않습니다.");
}

// SQL 업데이트 준비
$sql = "UPDATE Patient SET address = ?, updated_at = NOW() WHERE patient_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL 준비 실패: " . $conn->error);
}

// 매개변수 바인딩 및 실행
$stmt->bind_param("si", $address, $patient_id);

if ($stmt->execute()) {
    header("Location: /kiosk/pages/document-selection/document-selection.php?patient_id=$patient_id");
    exit();
} else {
    die("데이터 업데이트 실패: " . $stmt->error);
}

// 리소스 닫기
$stmt->close();
$conn->close();
?>
