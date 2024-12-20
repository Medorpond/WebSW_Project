<?php
// .env 로드
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

// .env 파일 로드
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');  // 프로젝트 루트 기준
    $dotenv->load();
} catch (Exception $e) {
    die("환경 변수 로드 실패: " . $e->getMessage());
}

// MySQL 연결 정보
$host = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];
$database = $_ENV['DB_NAME'];
$port = $_ENV['DB_PORT'];

// MySQL 연결
$conn = mysqli_connect($host, $username, $password, $database, $port);

// 연결 확인
if (!$conn) {
    die('MySQL 연결 실패: ' . mysqli_connect_error());
}
?>
