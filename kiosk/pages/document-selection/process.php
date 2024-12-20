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
    $selected_documents = $_POST['selected_documents'] ?? '';

    // 데이터 검증
    if (!$patient_id || empty($selected_documents)) {
        throw new Exception("잘못된 입력 데이터입니다.");
    }

    // JSON 형식 확인
    $documentsArray = json_decode($selected_documents, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON 형식이 유효하지 않습니다. 오류: " . json_last_error_msg() . " | 원본 데이터: $selected_documents");
    }

    // 선택 문서 유효성 검사
    $validDocuments = ["0", "1", "2", "3"];
    foreach ($documentsArray as $doc) {
        if (!in_array((string)$doc, $validDocuments, true)) {
            throw new Exception("유효하지 않은 문서 선택 값입니다.");
        }
    }

    if (in_array("0", $documentsArray, true) && count($documentsArray) > 1) {
        throw new Exception("필요없음과 다른 문서를 함께 선택할 수 없습니다.");
    }

    // JSON 저장
    $jsonDocuments = json_encode($documentsArray);

    $sql = "INSERT INTO Application (patient_id, document, created_at, updated_at, `call`) 
        VALUES (?, ?, NOW(), NOW(), '0')";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL 준비 실패: " . $conn->error);
    }

    $stmt->bind_param("is", $patient_id, $jsonDocuments);

    if ($stmt->execute()) {
        $application_id = $stmt->insert_id; // 생성된 application_id 가져오기

        // 리다이렉트 시 application_id도 함께 전달
        header("Location: /kiosk/pages/visit-purpose/visit-purpose.php?patient_id=$patient_id&application_id=$application_id");
        exit();
    } else {
        throw new Exception("데이터 업데이트 실패: " . $stmt->error);
    }

} catch (Exception $e) {
    die("오류 발생: " . $e->getMessage());
} finally {
    // 리소스 닫기
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
