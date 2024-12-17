// formulario.js

// Função para validar o formulário antes de enviar
function validateForm(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Obtém os valores dos campos
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const number = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('Confirmemail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('Confirmpassword').value;

    // Validação básica
    if (firstname === '' || lastname === '' || number === '' || email === '' || 
        confirmEmail === '' || password === '' || confirmPassword === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (email !== confirmEmail) {
        alert('Os e-mails não coincidem.');
        return;
    }

    // Validação das senhas
    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, verifique os campos de senha.');
        return;
    }

    // Se tudo estiver correto, envia os dados para o backend Flask
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
        if (data.success) {
            alert('Formulário enviado com sucesso!');
            window.location.href = 'pagina_principal.html'; // Redireciona para a página principal após o envio
        } else {
            alert('Erro ao enviar os dados. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente.');
    });
}

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