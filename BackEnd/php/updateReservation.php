<?php
require_once 'generalFunction.php';

$pdo = getPdo();
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
                $stmt = $pdo->prepare("SELECT * FROM Reservation WHERE patient_id = :name AND time = :time");
                $stmt->execute([
                    ':name' => $data['name'],
                    ':time' => $data['time']
                ]);

                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($result) {
                    echo json_encode([
                        'success' => true,
                        'name' => $data['name'],
                        'time' => $data['time']
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => "예약 정보를 찾을 수 없습니다."
                    ]);
                }
            } catch (PDOException $e) {
                echo json_encode([
                    'success' => false,
                    'message' => "예약 조회 중 오류가 발생했습니다."
                ]);
            }
            break;

        case 'cancel':
            try {
                $stmt = $pdo->prepare("DELETE FROM Reservation WHERE patient_id = :name AND time = :time");
                $stmt->execute([
                    ':name' => $data['name'],
                    ':time' => $data['time']
                ]);

                if ($stmt->rowCount() > 0) {
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
            } catch (PDOException $e) {
                echo json_encode([
                    'success' => false,
                    'message' => "예약 취소 중 오류가 발생했습니다."
                ]);
            }
            break;
    }
} else if (isset($data['name'], $data['contact'], $data['date'], $data['time'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO Reservation (patient_id, date, time, created_at, updated_at) VALUES (:contact, :date, :time, NOW(), NOW())");
        $stmt->execute([
            ':contact' => $data['contact'],
            ':date' => $data['date'],
            ':time' => $data['time']
        ]);

        echo json_encode([
            'success' => true,
            'message' => "예약이 성공적으로 등록되었습니다."
        ]);
    } catch (PDOException $e) {
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
