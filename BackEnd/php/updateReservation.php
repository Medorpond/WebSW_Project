<?php
/** @var mysqli $conn */
require_once __DIR__ . '/../../config/dbconnection.php';

header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

// action에 따른 처리
if (isset($data['action'])) {
    switch ($data['action']) {
        case 'view':
            try {
                $stmt = $conn->prepare("SELECT * FROM Reservation WHERE name = ? AND patient_id = ?");
                $stmt->bind_param("ss", $data['name'], $data['contact']);
                $stmt->execute();
                $result = $stmt->get_result();
                $row = $result->fetch_assoc();

                if ($row) {
                    echo json_encode([
                        'success' => true,
                        'name' => $data['name'],
                        'time' => $row['time']
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => "예약 정보를 찾을 수 없습니다."
                    ]);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => "예약 조회 중 오류가 발생했습니다."
                ]);
            }
            break;

        case 'cancel':
            try {
                $stmt = $conn->prepare("DELETE FROM Reservation WHERE name = ? AND patient_id = ?");
                $stmt->bind_param("ss", $data['name'], $data['contact']);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo json_encode([
                        'success' => true,
                        'message' => "예약이 성공적으로 취소되었습니다."
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => "취소할 예약을 찾을 수 없습니다."
                    ]);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => "예약 취소 중 오류가 발생했습니다."
                ]);
            }
            break;
    }
} else if (isset($data['name'], $data['contact'], $data['time'])) {
    try {
        // 1. patient_id가 이미 존재하는지 확인
        $stmt = $conn->prepare("SELECT COUNT(*) FROM Reservation WHERE patient_id = ?");
        $stmt->bind_param("s", $data['contact']);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_row()[0];

        if ($count > 0) {
            echo json_encode([
                'success' => false,
                'message' => "예약 이력이 있습니다. 예약 확인을 통해 확인해주세요."
            ]);
            exit;
        }

        // 2. 동일 시간과 +30분 한 시간의 예약자 수 합이 세 건 이상인지 확인
        $stmt = $conn->prepare("SELECT COUNT(*) FROM Reservation WHERE time BETWEEN ? AND ADDTIME(?, '00:30:00')");
        $stmt->bind_param("ss", $data['time'], $data['time']);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_row()[0];

        if ($count >= 3) {
            echo json_encode([
                'success' => false,
                'message' => "해당 시간대 예약이 불가합니다. 다른 시간을 선택해주세요."
            ]);
            exit;
        }



        $stmt = $conn->prepare("INSERT INTO Reservation (patient_id, name, time, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("sss", $data['contact'], $data['name'], $data['time']);
        $stmt->execute();

        echo json_encode([
            'success' => true,
            'message' => "예약이 성공적으로 등록되었습니다."
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => "예약 등록 중 오류가 발생했습니다."
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => "필수 입력 항목이 누락되었습니다."
    ]);
}

// 연결 종료
$conn->close();
