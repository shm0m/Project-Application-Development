<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Connexion à la base de données
$host = 'localhost';
$dbname = 'dietethic';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données : " . $e->getMessage()]);
    exit;
}

// Lecture des données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['name'], $data['age'], $data['height'], $data['weight'], $data['gender'], $data['goal'], $data['mail'], $data['password'])
) {
    $name = htmlspecialchars($data['name']);
    $age = (int) $data['age'];
    $height = (float) $data['height'];
    $weight = (float) $data['weight'];
    $gender = htmlspecialchars($data['gender']);
    $goal = htmlspecialchars($data['goal']);
    $mail = htmlspecialchars($data['mail']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT); // Sécurisation du mot de passe

    try {
        // Requête SQL pour insérer les données
        $sql = "INSERT INTO users (name, age, height, weight, gender, goal, mail, password, created_at) 
                VALUES (:name, :age, :height, :weight, :gender, :goal, :mail, :password, NOW())";
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':name' => $name,
            ':age' => $age,
            ':height' => $height,
            ':weight' => $weight,
            ':gender' => $gender,
            ':goal' => $goal,
            ':mail' => $mail,
            ':password' => $password
        ]);

        echo json_encode(["success" => true, "message" => "Utilisateur enregistré avec succès"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'insertion des données : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Paramètres manquants ou invalides"]);
}
?>
