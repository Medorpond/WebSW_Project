<?php
// DB 연결
require_once __DIR__ . '/../../../config/dbconnection.php';

// 폼 데이터 받기
$name = trim($_POST['name']);
$ssn_front = trim($_POST['ssn_front']);
$ssn_back = trim($_POST['ssn_back']);
$phone_number = trim($_POST['phone_number']);
$consent = isset($_POST['consent']) ? 1 : 0;

// 주민등록번호 병합
$full_ssn = $ssn_front . $ssn_back;

// 데이터 검증
if (empty($name) || empty($ssn_front) || empty($ssn_back) || empty($phone_number)) {
    die("모든 필드를 입력해주세요.");
}

// DB 삽입 쿼리
$sql = "INSERT INTO Patient (name, ssh, phone_number, consent, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL 준비 실패: " . $conn->error);
}

$stmt->bind_param("sssi", $name, $full_ssn, $phone_number, $consent);

if ($stmt->execute()) {
    // 환자 ID 가져오기
    $patient_id = $stmt->insert_id;
    header("Location: /kiosk/pages/address/address.php?patient_id=$patient_id");
    exit();
} else {
    echo "데이터 삽입 실패: " . $stmt->error;
}

// 리소스 닫기
$stmt->close();
$conn->close();
?>
