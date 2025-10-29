<?php
session_start();

// Config DB
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "pecaaq"; // sem acento

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Recebe dados
$tipo = $_POST['tipo'] ?? '';
$login = trim($_POST['login'] ?? '');
$senha = $_POST['senha'] ?? '';

if (empty($tipo) || empty($login) || empty($senha)) {
    die("⚠ Todos os campos são obrigatórios!");
}

// Normaliza login (remove pontuação para comparar com documento)
$loginLimpo = preg_replace('/\D/', '', $login);

// Define qual valor de tipo esperamos na tabela usuarios
// Permitimos 'Cliente' ou 'Fornecedor' (ou 'Empresa' vindo do formulário — tratamos como Fornecedor)
$tipo_map = strtolower($tipo) === 'empresa' ? 'Fornecedor' : ucfirst(strtolower($tipo));
if (!in_array($tipo_map, ['Cliente', 'Fornecedor'])) {
    die("Tipo de login inválido!");
}

// Prepara query: buscamos pelo email ou pelo documento (campo 'documento' unificado)
$sql = "SELECT id_usuario, nome_razao_social, email, senha_hash, tipo, documento 
        FROM usuarios 
        WHERE tipo = ? AND (email = ? OR documento = ?) 
        LIMIT 1";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Erro na query: " . $conn->error);
}

$stmt->bind_param("sss", $tipo_map, $login, $loginLimpo);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    die("❌ Usuário não encontrado!");
}

$usuario = $result->fetch_assoc();
$stmt->close();

// Verifica senha usando password_verify com o campo senha_hash
if (!isset($usuario['senha_hash']) || !password_verify($senha, $usuario['senha_hash'])) {
    $conn->close();
    die("❌ Senha incorreta!");
}

// Cria sessão (nomes compatíveis com cadastro)
$_SESSION['id_usuario'] = $usuario['id_usuario'];
$_SESSION['nome_razao_social'] = $usuario['nome_razao_social'];
$_SESSION['tipo_usuario'] = $usuario['tipo'];

// Redireciona conforme tipo (ajuste as rotas conforme seu projeto)
if ($usuario['tipo'] === 'Fornecedor') {
    // linha exemplo: painel do fornecedor
    header("Location: ../LaningPage/indexLandingPage.html");
} else {
    // comprador / cliente
    header("Location: ../LaningPage/indexLandingPage.html");
}

$conn->close();
exit;
?>