// Formulário de Cadastro
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dadosCadastro = {
        nome: nome,
        email: email,
        senha: senha
    };

    // Envia os dados para o backend Flask
    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
    })
    .catch(error => {
        console.error('Erro:', error);  // Trata qualquer erro
        alert('Ocorreu um erro ao salvar os dados.');
    });
});

// Formulário de Alteração de Senha
document.getElementById('senhaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const email = document.getElementById('email').value;  // Supondo que o email também seja enviado

    // Verifica se as senhas são iguais
    if (novaSenha === confirmarSenha) {
        const dadosSenha = {
            novaSenha: novaSenha,
            email: email
        };

        // Envia os dados para o backend Flask
        fetch('/alterar_senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosSenha)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
        })
        .catch(error => {
            console.error('Erro:', error);  // Trata qualquer erro
            alert('Ocorreu um erro ao alterar a senha.');
        });
    } else {
        alert('As senhas não coincidem!');
    }
});
