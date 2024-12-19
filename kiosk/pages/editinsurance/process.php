<?php
// 오류 출력 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB 연결
require_once __DIR__ . '/../../../config/dbconnection.php';

header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // 보험사 목록 조회
        $query = "SELECT * FROM Insurance ORDER BY Insurance_list_id ASC";
        $result = $conn->query($query);

        if (!$result) {
            throw new Exception("쿼리 실행 실패: " . $conn->error);
        }

        $insurances = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($insurances);
    } 

    elseif ($method === 'POST') {
        // 보험사 추가 및 수정 분기
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';  // 작업 유형 확인
        $insuranceListId = isset($input['Insurance_list_id']) ? intval($input['Insurance_list_id']) : 0;
        $insuranceList = trim($input['insurance_list'] ?? '');
        $code = trim($input['code'] ?? '');
    
        if (empty($insuranceList) || empty($code)) {
            throw new Exception("보험사 이름과 코드를 입력해주세요.");
        }
    
        if ($action === 'update' && $insuranceListId > 0) {
            // 보험사 수정
            $stmt = $conn->prepare("UPDATE Insurance SET insurance_list = ?, code = ?, updated_at = NOW() WHERE Insurance_list_id = ?");
            $stmt->bind_param('ssi', $insuranceList, $code, $insuranceListId);
    
            if (!$stmt->execute()) {
                throw new Exception("수정 실패: " . $stmt->error);
            }
    
            echo json_encode(['success' => true, 'message' => '보험사가 수정되었습니다.']);
        } elseif ($action === 'add') {
            // 보험사 추가
            $stmt = $conn->prepare("INSERT INTO Insurance (insurance_list, code, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
            $stmt->bind_param('ss', $insuranceList, $code);
    
            if (!$stmt->execute()) {
                throw new Exception("추가 실패: " . $stmt->error);
            }
    
            echo json_encode(['success' => true, 'message' => '보험사가 추가되었습니다.']);
        } else {
            throw new Exception("잘못된 작업입니다.");
        }
    }
    

    elseif ($method === 'DELETE') {
        // 보험사 삭제
        $input = json_decode(file_get_contents('php://input'), true);
        $insuranceListId = intval($input['Insurance_list_id'] ?? 0);
    
        if (!$insuranceListId) {
            throw new Exception("삭제 요청에 Insurance_list_id가 없습니다.");
        }
    
        $stmt = $conn->prepare("DELETE FROM Insurance WHERE Insurance_list_id = ?");
        $stmt->bind_param('i', $insuranceListId);
    
        if (!$stmt->execute()) {
            throw new Exception("삭제 실패: " . $stmt->error);
        }
    
        echo json_encode(['success' => true, 'message' => '보험사가 삭제되었습니다.']);
    }    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
