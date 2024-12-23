// Função para enviar os dados do formulário para o backend
function enviarCadastro() {
    // Coletando os dados do formulário
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const number = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        firstname: firstname,
        lastname: lastname,
        number: number,
        email: email,
        password: password
    };

    // Envia os dados para o backend Flask via fetch
    fetch('/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data); // Verifica a resposta do servidor
        if (data.success) {
            console.log('Cadastro bem-sucedido, redirecionando para a página principal...');
            
            // Armazenando a mensagem de boas-vindas no localStorage
            localStorage.setItem('registrationMessage', `Bem-vindo, ${firstname}! Cadastro realizado com sucesso! Bem-vindo(a) ao nosso site.`);
            
            // Redireciona para a página principal
            window.location.href = 'index.html';
            // Adiciona um pequeno atraso antes de redirecionar
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);  // Aguarda 1 segundo (1000 ms) para garantir que o localStorage seja salvo
        } else {
            console.error('Erro ao cadastrar:', data);
            alert('Erro ao enviar os dados. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro de rede ou backend:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
}

// Função para exibir a mensagem de boas-vindas na página principal
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há uma mensagem de boas-vindas no localStorage
    const welcomeMessage = localStorage.getItem('registrationMessage');
    
    // Se houver, exibe a mensagem e a remove do localStorage
    if (welcomeMessage) {
        const messageContainer = document.getElementById('welcome-message');
        if (messageContainer) {
            messageContainer.innerText = welcomeMessage;
        }
        localStorage.removeItem('registrationMessage'); // Remove a mensagem após exibi-la
    }
});

// Olho mágico das senhas
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`.toggle-password[onclick="togglePassword('${inputId}')"] i`);

    // Alterna o tipo do input
    const type = input.type === "password" ? "text" : "password";
    input.type = type;

    // Muda o ícone baseado no estado
    icon.classList.toggle("fa-eye-slash"); // Olho fechado
    icon.classList.toggle("fa-eye"); // Olho aberto
}

// Adiciona event listener para o envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form'); // Seleciona o formulário
    if (form) {
        form.addEventListener('submit', validateForm); // Adiciona a validação ao evento de envio
    }
});