// Função para enviar os dados do formulário para o backend
async function enviarCadastro() {
    // Coletando os dados do formulário
    const firstname = document.getElementById('firstname').value.trim();
    const number = document.getElementById('number').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validação básica no frontend
    if (!firstname || !number || !email || !password) {
        alert('Todos os campos são obrigatórios!');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Dados do formulário
    const userData = { firstname, number, email, password };

    try {
        // Envia os dados para o backend Flask via fetch
        const response = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log('Cadastro bem-sucedido:', data);

            // Redireciona para a página principal
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
            event.preventDefault(); // Impede o envio padrão
            enviarCadastro(); // Chama a função de envio
        });
    }
});
