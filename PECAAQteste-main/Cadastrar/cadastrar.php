<?php
session_start();

// Conexão com o banco
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "peçaaq"; // sem acento

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Recebendo dados do formulário
$tipo = $_POST['tipo'] ?? '';
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$cpf_cnpj = preg_replace('/\D/', '', $_POST['cpf_cnpj'] ?? '');
$telefone = $_POST['telefone'] ?? '';

// Funções de validação
function validaCPF($cpf) {
    if (strlen($cpf) != 11 || preg_match('/(\d)\1{10}/', $cpf)) return false;
    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) $d += $cpf[$c] * (($t + 1) - $c);
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) return false;
    }
    return true;
}

function validaCNPJ($cnpj) {
    if (strlen($cnpj) != 14) return false;
    $soma1 = $soma2 = 0;
    $pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    $pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    for ($i=0;$i<12;$i++) $soma1 += $cnpj[$i]*$pesos1[$i];
    $d1 = ($soma1%11<2)?0:11-($soma1%11);
    for ($i=0;$i<13;$i++) $soma2 += $cnpj[$i]*$pesos2[$i];
    $d2 = ($soma2%11<2)?0:11-($soma2%11);
    return ($cnpj[12]==$d1 && $cnpj[13]==$d2);
}

// Validação básica
if (empty($tipo) || empty($nome) || empty($email) || empty($senha) || empty($cpf_cnpj)) {
    die("⚠️ Preencha todos os campos obrigatórios!");
}

// Criptografa a senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Monta query segura
if ($tipo === 'Cliente') {
    if (!validaCPF($cpf_cnpj)) die("CPF inválido!");
    $stmt = $conn->prepare("INSERT INTO usuarios (tipo, nome_razao_social, email, senha, cpf, telefone) VALUES (?, ?, ?, ?, ?, ?)");
} elseif ($tipo === 'Empresa') {
    if (!validaCNPJ($cpf_cnpj)) die("CNPJ inválido!");
    $stmt = $conn->prepare("INSERT INTO usuarios (tipo, nome_razao_social, email, senha, cnpj, telefone) VALUES (?, ?, ?, ?, ?, ?)");
} else {
    die("Tipo de cadastro inválido!");
}

// Bind seguro
$stmt->bind_param("ssssss", $tipo, $nome, $email, $senha_hash, $cpf_cnpj, $telefone);

// Executa
if ($stmt->execute()) {
    echo "<h3>Cadastro de $tipo realizado com sucesso!</h3>";
    echo "<a href='../Login/indexLogin.html'>Voltar para o login</a>";
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
