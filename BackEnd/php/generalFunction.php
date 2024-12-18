<?php
/**
 * @return PDO|void
 */
function getPdo()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $host = 'webswdb.c1o2ecie4r89.ap-northeast-2.rds.amazonaws.com';
    $dbname = 'webswDB';
    $username = 'root';
    $password = 'dnpqtmroot';

    try {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";
        $pdo = new PDO($dsn, $username, $password, array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
        ));
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => '데이터베이스 연결 오류']);
        exit;
    }
    return $pdo;
}