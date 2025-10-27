<?php
session_start();

// Conexão com o banco
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "peçaaq";

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) die("Erro na conexão: " . $conn->connect_error);

// Recebe dados
$tipo = $_POST['tipo'] ?? '';
$login = trim($_POST['login'] ?? '');
$senha = $_POST['senha'] ?? '';

if (empty($tipo) || empty($login) || empty($senha)) die("⚠️ Todos os campos são obrigatórios!");

// Limpa CPF/CNPJ
$loginLimpo = preg_replace('/\D/', '', $login);

// Prepara query
if ($tipo === 'Cliente') {
    $stmt = $conn->prepare("SELECT id, nome_razao_social, email, senha, tipo, cpf FROM usuarios WHERE tipo='Cliente' AND (email=? OR cpf=?) LIMIT 1");
    $stmt->bind_param("ss", $login, $loginLimpo);
} elseif ($tipo === 'Empresa') {
    $stmt = $conn->prepare("SELECT id, nome_razao_social, email, senha, tipo, cnpj FROM usuarios WHERE tipo='Empresa' AND (email=? OR cnpj=?) LIMIT 1");
    $stmt->bind_param("ss", $login, $loginLimpo);
} else {
    die("Tipo de login inválido!");
}

// Executa
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) die("❌ Usuário não encontrado!");

$usuario = $result->fetch_assoc();

// Verifica senha
if (!password_verify($senha, $usuario['senha'])) die("❌ Senha incorreta!");

// Cria sessão
$_SESSION['id'] = $usuario['id'];
$_SESSION['nome'] = $usuario['nome_razao_social'];
$_SESSION['tipo'] = $usuario['tipo'];

// Redireciona
if ($usuario['tipo'] === 'Empresa') {
    header("Location: ../Produtos/index.html");
} else {
    header("Location: ../Produtos/index.html");
}
exit;
?>
