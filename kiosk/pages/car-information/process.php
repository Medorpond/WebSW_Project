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
    $application_id = filter_input(INPUT_POST, 'application_id', FILTER_VALIDATE_INT);
    $insurance_code = filter_input(INPUT_POST, 'insurance', FILTER_SANITIZE_STRING);
    $reference_number = filter_input(INPUT_POST, 'reference_number', FILTER_SANITIZE_STRING);

    // 데이터 검증
    if (!$patient_id || !$application_id || empty($insurance_code) || empty($reference_number)) {
        throw new Exception("모든 필드를 입력해주세요.");
    }

    // 보험사 ID 가져오기
    $insuranceQuery = "SELECT Insurance_list_id FROM Insurance WHERE code = ?";
    $stmt = $conn->prepare($insuranceQuery);

    if (!$stmt) {
        throw new Exception("보험사 ID 조회 실패: " . $conn->error);
    }

    $stmt->bind_param("s", $insurance_code);
    $stmt->execute();
    $stmt->bind_result($insurance_list_id);
    $stmt->fetch();
    $stmt->close();

    if (!$insurance_list_id) {
        throw new Exception("유효하지 않은 보험사 코드입니다.");
    }

    // `Insurance_accept` 테이블에 데이터 삽입
    $insertQuery = "INSERT INTO Insurance_accept (patient_id, application_id, application_number, Insurance_list_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, NOW(), NOW())";

    $stmt = $conn->prepare($insertQuery);

    if (!$stmt) {
        throw new Exception("데이터 삽입 준비 실패: " . $conn->error);
    }

    $stmt->bind_param("iisi", $patient_id, $application_id, $reference_number, $insurance_list_id);

    if ($stmt->execute()) {
        $insurance_id = $stmt->insert_id;

        // 다음 페이지로 이동
        header("Location: /kiosk/pages/car-form/car-form.php?patient_id=$patient_id&insurance_id=$insurance_id");
        exit();
    } else {
        throw new Exception("데이터 삽입 실패: " . $stmt->error);
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
