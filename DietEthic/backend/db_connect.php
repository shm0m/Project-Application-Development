<?php
$host = 'localhost';
$user = 'root';
$password = '';
$db_name = 'dietethic'; 

$conn = new mysqli($host, $user, $password, $db_name);

if ($conn->connect_error) {
    die('Erreur de connexion à la base de données : ' . $conn->connect_error);
}
?>
