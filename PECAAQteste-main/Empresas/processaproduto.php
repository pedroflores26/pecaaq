<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "pecaaq";

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Dados do formulário
$nome = $_POST['nome'];
$sku = $_POST['sku'] ?? null;
$marca = $_POST['marca'] ?? null;
$descricao = $_POST['descricao'] ?? null;
$preco = $_POST['preco'] ?? null;

// Upload da imagem
$foto = $_FILES['foto']['name'];
$pasta = "uploads/";

if (!is_dir($pasta)) {
    mkdir($pasta, 0777, true);
}

$caminho_final = $pasta . basename($foto);

if (move_uploaded_file($_FILES['foto']['tmp_name'], $caminho_final)) {
    $sql = "INSERT INTO produtos (nome, sku_universal, marca, descricao_tecnica, foto_principal, preco) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("ssssss", $nome, $sku, $marca, $descricao, $foto, $preco);
        if ($stmt->execute()) {
            echo "<script>alert('✅ Produto cadastrado com sucesso!'); window.location.href='indexEmpresas.html';</script>";
        } else {
            echo "Erro ao salvar produto: " . $stmt->error;
        }
        $stmt->close();
    } else {
        echo "Erro na preparação da query: " . $conn->error;
    }
} else {
    echo "Erro ao fazer upload da imagem.";
}

$conn->close();
?>
