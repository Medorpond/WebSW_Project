<?php
// HTTP 응답 헤더: JSON 형식 설정
header('Content-Type: application/json');

// 클라이언트에서 전송된 JSON 데이터를 읽기
$data = json_decode(file_get_contents('php://input'), true);

// 데이터가 제대로 전송되었는지 확인
if (isset($data['name'], $data['contact'], $data['date'], $data['time'])) {
    // 전송된 데이터를 읽음
    $name = $data['name'];
    $contact = $data['contact'];
    $date = $data['date'];
    $time = $data['time'];

    // 항상 성공을 반환 (실제 DB 연동은 구현하지 않음)
    echo json_encode([
        'success' => true,
        'message' => "Reservation received for $name on $date at $time."
    ]);
} else {
    // 데이터가 누락되었을 경우 실패 메시지 반환
    echo json_encode([
        'success' => false,
        'message' => "Invalid reservation data. Please provide all required fields."
    ]);
}