// Formulário de Cadastro
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Validações básicas
    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor, insira um email válido.');
        return;
    }

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
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
        document.getElementById('cadastroForm').reset(); // Limpa o formulário após sucesso
    })
    .catch(error => {
        console.error('Erro:', error);  // Trata qualquer erro
        alert('Ocorreu um erro ao salvar os dados. Por favor, tente novamente.');
    });
});

// Formulário de Alteração de Senha
document.getElementById('senhaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const email = document.getElementById('email').value.trim();

    // Validações
    if (!email || !novaSenha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor, insira um email válido.');
        return;
    }

    if (novaSenha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

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
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
            document.getElementById('senhaForm').reset(); // Limpa o formulário após sucesso
        })
        .catch(error => {
            console.error('Erro:', error);  // Trata qualquer erro
            alert('Ocorreu um erro ao alterar a senha. Por favor, tente novamente.');
        });
    } else {
        alert('As senhas não coincidem!');
    }
});
