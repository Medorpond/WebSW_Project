<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');

echo json_encode(['isAdmin' => isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true]);
