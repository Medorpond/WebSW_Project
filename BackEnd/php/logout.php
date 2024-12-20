<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

$_SESSION['is_admin'] = false;
unset($_SESSION['admin_id']);

echo json_encode(['success' => true]);
