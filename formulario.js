// Função para enviar os dados do formulário para o backend
async function enviarCadastro() {
    // Coletando os dados do formulário
    const firstname = document.getElementById('firstname').value.trim();
    const number = document.getElementById('number').value.trim();
    const email = document.getElementById('email').value.trim();
    const confirmemail = document.getElementById('confirmemail').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validação básica no frontend
    if (!firstname || !number || !email || !confirmemail || !password) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    if (email !== confirmemail) {
        alert('Os e-mails não correspondem.');
        return;
    }

    // Validação do número de telefone (formato brasileiro)
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (!phoneRegex.test(number)) {
        alert('Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX');
        return;
    }

    // Validação de senha
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    // Dados do formulário
    const userData = { firstname, number, email, password };

    try {
        // Envia os dados para o backend Flask via fetch
        const response = await fetch('http://127.0.0.1:5000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();

        if (response.ok) {
            console.log('Cadastro bem-sucedido:', data);
            alert(`Bem-vindo, ${firstname}! Cadastro realizado com sucesso.`);
            window.location.href = 'index.html';
        } else {
            throw new Error(data.message || 'Erro ao realizar o cadastro.');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Ocorreu um erro ao enviar os dados. Tente novamente.');
    }
}

// Função para alternar a visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`.toggle-password[onclick="togglePassword('${inputId}')"] i`);

    // Alterna o tipo do input
    input.type = input.type === 'password' ? 'text' : 'password';

    // Alterna os ícones
    icon.classList.toggle('fa-eye-slash');
    icon.classList.toggle('fa-eye');
}

// Adiciona event listener para o envio do formulário
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Seleciona o formulário
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            enviarCadastro();
        });
    }

    // Adiciona máscara para o campo de telefone
    const phoneInput = document.getElementById('number');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                e.target.value = value;
            }
        });
    }
});
