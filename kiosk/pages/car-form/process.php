<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // DB 연결
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // 폼 데이터 받기
    $patient_id = filter_input(INPUT_POST, 'patient_id', FILTER_VALIDATE_INT);
    $insurance_id = filter_input(INPUT_POST, 'insurance_id', FILTER_VALIDATE_INT);
    $responsible_name = filter_input(INPUT_POST, 'responsible_name', FILTER_SANITIZE_STRING);
    $responsible_phone = filter_input(INPUT_POST, 'responsible_phone', FILTER_SANITIZE_STRING);

    // 데이터 검증
    if ($patient_id === null || $insurance_id === null || empty($responsible_name) || empty($responsible_phone)) {
        throw new Exception("모든 필드를 입력해주세요. 입력된 값: patient_id={$patient_id}, insurance_id={$insurance_id}, responsible_name={$responsible_name}, responsible_phone={$responsible_phone}");
    }    

    // SQL 업데이트 쿼리
    $sql = "UPDATE Insurance_accept 
            SET mgr_name = ?, mgr_phone = ?, updated_at = NOW() 
            WHERE patient_id = ? AND insurance_id = ?";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL 준비 실패: " . $conn->error);
    }

    // 데이터 바인딩 및 실행
    $stmt->bind_param("ssii", $responsible_name, $responsible_phone, $patient_id, $insurance_id);

    if ($stmt->execute()) {
        header("Location: /kiosk/pages/complete-msg/complete-msg.php?patient_id=$patient_id&insurance_id=$insurance_id");
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
