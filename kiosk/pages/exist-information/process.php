<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // 폼 데이터 받기
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $id_front = filter_input(INPUT_POST, 'id_front', FILTER_SANITIZE_STRING);
    $id_back = filter_input(INPUT_POST, 'id_back', FILTER_SANITIZE_STRING);

    // 데이터 검증
    if ($phone === null || $id_front === null || $id_back === null) {
        throw new Exception("모든 필드를 입력해주세요.");
    }

    // 환자 조회
    $sql = "SELECT patient_id, name FROM Patient WHERE phone_number = ? AND LEFT(ssh, 7) = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL 준비 실패: " . $conn->error);
    }

    $full_ssn = $id_front . $id_back;
    $stmt->bind_param("ss", $phone, $full_ssn);
    $stmt->execute();
    $stmt->bind_result($patient_id, $patient_name);
    $stmt->fetch();
    $stmt->close();

    if (!$patient_id) {
        header("Location: /kiosk/pages/exist-information/exist-information.php?error=not_found");
        exit();
    }

    // 본인 확인 화면으로 이동
    header("Location: /kiosk/pages/confirmation/confirmation.php?patient_id=$patient_id&patient_name=$patient_name");
    exit();

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
