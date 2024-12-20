<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    // DB 연결
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // GET 요청 처리 - 대기 환자 목록
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sql = "
           SELECT 
            a.application_id,
            p.name,
            DATE_FORMAT(a.created_at, '%m-%d %H:%i') AS received_at,
            p.ssh AS ssh,
            p.phone_number AS phone,
            p.address,
            a.disease AS visit_purpose,
            i.Insurance_list AS insurance_company,
            ia.application_number AS application_code,
            ia.mgr_name AS manager_name,
            ia.mgr_phone AS manager_phone,
            JSON_UNQUOTE(a.document) AS documents,
            a.`call`
        FROM Application a
        LEFT JOIN Patient p ON a.patient_id = p.patient_id
        LEFT JOIN Insurance_accept ia ON a.application_id = ia.application_id
        LEFT JOIN Insurance i ON ia.Insurance_list_id = i.Insurance_list_id
        WHERE a.`call` IN ('0', '1')
        ORDER BY a.created_at ASC;
        ";

        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception("쿼리 실행 실패: " . $conn->error);
        }

        $patients = [];
        while ($row = $result->fetch_assoc()) {
            $patients[] = $row;
        }

        echo json_encode([
            "status" => "success",
            "data" => $patients
        ]);
    }

    // POST 요청 처리 - 환자 호출
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $application_id = intval($input['application_id']);
        $status = strval($input['status']); // ENUM 값은 문자열로 변환
    
        // 유효성 검사
        if (!$application_id || !in_array($status, ['0', '1', '2'], true)) {
            throw new Exception("유효하지 않은 요청입니다.");
        }
    
        // 환자 호출 상태 업데이트
        $updateSql = "UPDATE Application SET `call` = ?, updated_at = NOW() WHERE application_id = ?";
        $stmt = $conn->prepare($updateSql);
    
        if (!$stmt) {
            throw new Exception("SQL 준비 실패: " . $conn->error);
        }
    
        // ENUM 값 바인딩
        $stmt->bind_param("si", $status, $application_id);
    
        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            throw new Exception("데이터 업데이트 실패: " . $stmt->error);
        }
    
        $stmt->close();
    }      
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
