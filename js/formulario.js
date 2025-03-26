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
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("A resposta não está no formato JSON!");
        }

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

// Adiciona event listener para alternar a visibilidade da senha
document.querySelectorAll('.toggle-password').forEach(item => {
    item.addEventListener('click', function () {
        const inputId = this.getAttribute('data-input-id');
        togglePassword(inputId);
    });
});

document.getElementById('number').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara (XX) XXXXX-XXXX automaticamente
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;

     e.target.value = value; // Atualiza o campo com a formatação correta
});


