<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

function clean_header_field($value) {
    return trim(preg_replace('/[\r\n]+/', ' ', (string) $value));
}

$formType = clean_header_field($_POST['form_type'] ?? '');
$nome = clean_header_field($_POST['nome'] ?? '');
$telefone = clean_header_field($_POST['telefone'] ?? '');
$email = clean_header_field($_POST['email'] ?? '');
$loja = clean_header_field($_POST['loja'] ?? '');
$mensagem = trim((string) ($_POST['mensagem'] ?? ''));
$detalhes = trim((string) ($_POST['detalhes'] ?? ''));
$comodos = $_POST['comodos'] ?? [];
if (!is_array($comodos)) {
    $comodos = [$comodos];
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'E-mail inválido']);
    exit;
}

$lojaEmails = [
    'Recreio' => 'recreio@liveambientes.com.br',
    'Tijuca'  => 'tijuca@liveambientes.com.br',
    'Niterói' => 'niteroi@liveambientes.com.br',
];
$allEmails = implode(', ', $lojaEmails);

switch ($formType) {
    case 'orcamento':
        if ($nome === '' || $telefone === '' || $email === '' || $loja === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Campos obrigatórios faltando']);
            exit;
        }
        $to = $lojaEmails[$loja] ?? $allEmails;
        $subject = "Novo orçamento pelo site — Loja $loja";
        $body = "Nome: $nome\n";
        $body .= "Telefone/WhatsApp: $telefone\n";
        $body .= "E-mail: $email\n";
        $body .= "Loja: $loja\n";
        $body .= "Cômodos de interesse: " . implode(', ', array_map('clean_header_field', $comodos)) . "\n\n";
        $body .= "Detalhes do projeto:\n$detalhes\n";
        break;

    case 'contato':
        if ($nome === '' || $telefone === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Campos obrigatórios faltando']);
            exit;
        }
        $to = $lojaEmails['Recreio'];
        $subject = 'Nova mensagem de contato pelo site';
        $body = "Nome: $nome\n";
        $body .= "Telefone/WhatsApp: $telefone\n";
        $body .= "E-mail: $email\n\n";
        $body .= "Mensagem:\n$mensagem\n";
        break;

    case 'newsletter':
        if ($email === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'E-mail obrigatório']);
            exit;
        }
        $to = $lojaEmails['Recreio'];
        $subject = 'Nova inscrição na newsletter pelo site';
        $body = "E-mail inscrito: $email\n";
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Tipo de formulário inválido']);
        exit;
}

$headers = "From: Site Live Ambientes <no-reply@liveambientes.com.br>\r\n";
if ($email !== '') {
    $headers .= "Reply-To: $email\r\n";
}

$hasAttachment = $formType === 'orcamento'
    && isset($_FILES['planta'])
    && $_FILES['planta']['error'] === UPLOAD_ERR_OK;

if ($hasAttachment) {
    $boundary = md5((string) microtime());
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $fileContent = chunk_split(base64_encode(file_get_contents($_FILES['planta']['tmp_name'])));
    $fileName = basename($_FILES['planta']['name']);
    $fileType = $_FILES['planta']['type'] ?: 'application/octet-stream';

    $fullBody = "--$boundary\r\n";
    $fullBody .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $fullBody .= $body . "\r\n\r\n";
    $fullBody .= "--$boundary\r\n";
    $fullBody .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
    $fullBody .= "Content-Transfer-Encoding: base64\r\n";
    $fullBody .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n";
    $fullBody .= $fileContent . "\r\n";
    $fullBody .= "--$boundary--";
} else {
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $fullBody = $body;
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$ok = mail($to, $encodedSubject, $fullBody, $headers);

echo json_encode(['ok' => $ok]);
