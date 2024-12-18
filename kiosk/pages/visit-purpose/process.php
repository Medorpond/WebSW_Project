<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // DB 연결
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // URL 및 폼 데이터 받기
    $patient_id = filter_input(INPUT_POST, 'patient_id', FILTER_VALIDATE_INT);
    $application_id = filter_input(INPUT_POST, 'application_id', FILTER_VALIDATE_INT);
    $purpose = filter_input(INPUT_POST, 'purpose', FILTER_SANITIZE_STRING);

    // 데이터 검증
    if (!$patient_id || !$application_id || empty($purpose)) {
        throw new Exception("잘못된 입력 데이터입니다.");
    }

    // SQL 업데이트 쿼리
    $sql = "UPDATE Application 
            SET disease = ?, updated_at = NOW() 
            WHERE application_id = ? AND patient_id = ?";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL 준비 실패: " . $conn->error);
    }

    // 바인딩 및 실행
    $stmt->bind_param("sii", $purpose, $application_id, $patient_id);

    if ($stmt->execute()) {
        // 선택된 목적에 따라 다음 페이지 이동
        if ($purpose === 'health' || $purpose === 'etc') {
            header("Location: /kiosk/pages/complete-msg/complete-msg.php?patient_id=$patient_id&application_id=$application_id");
        } elseif ($purpose === 'car') {
            header("Location: /kiosk/pages/car-information/car-information.php?patient_id=$patient_id&application_id=$application_id");
        }
        exit();
    } else {
        throw new Exception("데이터 업데이트 실패: " . $stmt->error);
    }

} catch (Exception $e) {
    die("오류 발생: " . $e->getMessage());
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
