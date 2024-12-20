<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    // DB 연결
    require_once __DIR__ . '/../../../config/dbconnection.php';

    // Application 테이블에서 대기/호출된 환자 목록 가져오기
    $sql = "
        SELECT 
            p.name, 
            LEFT(p.ssh, 2) AS birth_year, 
            a.`call`
        FROM Application a 
        JOIN Patient p ON a.patient_id = p.patient_id
        WHERE a.`call` IN ('0', '1')
        ORDER BY a.created_at ASC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("쿼리 실행 실패: " . $conn->error);
    }

    $patients = [];

    while ($row = $result->fetch_assoc()) {
        $patients[] = [
            'name' => $row['name'],
            'birth_year' => $row['birth_year'],
            'call' => $row['call']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $patients
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
