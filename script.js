// Função para exibir mensagem ao adicionar produto
const addToCartButtons = document.querySelectorAll('.add-to-cart');

function showMessage(productName) {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerText = `${productName}\n\nFoi adicionado ao seu carrinho com sucesso!`;
    
    // Exibir contêiner de mensagem
    messageContainer.style.display = 'block'; // Exibe o contêiner da mensagem
    
    // Ocultar contêiner após 5 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none'; // Oculta após 5 segundos
    }, 3000); // Ajuste o tempo conforme necessário
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produto) {
    // Verifica se já existe um carrinho no localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.nome === produto.nome);
    
    if (produtoExistente) {
        // Se o produto já estiver no carrinho, aumenta a quantidade
        produtoExistente.quantidade += 1;
    } else {
        // Se não estiver, adiciona o produto ao carrinho com quantidade inicial 1
        carrinho.push({...produto, quantidade: 1});
    }
    
    // Atualiza o localStorage com os novos dados do carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Chame a função showMessage para exibir a mensagem
    showMessage(produto.nome); // Alteração feita aqui
}

// Produtos aqui 
document.addEventListener('DOMContentLoaded', function() {
const produtos = [ 
    {
            nome: 'Bolsa de Crochê 1',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 199.00,
            imagem: 'bolsas/foto 1.jpg'
          
        },
        {
            nome: 'Bolsa de Crochê 2',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 150.00,
            imagem: 'bolsas/foto 2.jpg'
        },
        {
            nome: 'Bolsa de Crochê 3',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 160.00,
            imagem: 'bolsas/foto 3.jpg'
        },
        {
            nome: 'Bolsa de Crochê 4',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 180.00,
            imagem: 'bolsas/foto 4.jpg'
        },
        {
            nome: 'Bolsa de Crochê 5',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 5.jpg'
        },
        {
            nome: 'Bolsa de Crochê 6',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 6.jpg'
        },
        {
            nome: 'Bolsa de Crochê 7',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 7.jpg'
        },
        {
            nome: 'Bolsa de Crochê 8',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 8.jpg'
        },
        {
            nome: 'Bolsa de Crochê 9',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 9.jpg'
        },
        {
            nome: 'Bolsa de Crochê 10',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 10.jpg'
        },
        {
            nome: 'Bolsa de Crochê 11',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 11.jpg'
        },
        {
            nome: 'Bolsa de Crochê 12',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 12.jpg'
        },
        {
            nome: 'Bolsa de Crochê 13',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 13.jpg'
        },
        {
            nome: 'Bolsa de Crochê 14',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 14.jpg'
        },
        {
            nome: 'Bolsa de Crochê 15',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 15.jpg'
        },
        {
            nome: 'Bolsa de Crochê 16',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 16.jpg'
        },
        {
            nome: 'Bolsa de Crochê 17',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 17.jpg'
        },
        {
            nome: 'Bolsa de Crochê 18',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 18.jpg'
        },
        {
            nome: 'Bolsa de Crochê 19',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 19.jpg'
        },
        {
            nome: 'Bolsa de Crochê 20',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 20.jpg'
        },
        {
            nome: 'Bolsa de Crochê 21',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 21.jpg'
        },
        {
            nome: 'Bolsa de Crochê 22',
            descricao: 'Peça confeccionada em fio náutico.',
            preco: 250.00,
            imagem: 'bolsas/foto 22.jpg'
        },
        // Adicione mais produtos conforme necessário
    ];

    let carrinho = [];
    const produtoLista = document.querySelector('.produtos-lista');

    produtos.forEach(produto => {
        const produtoItem = document.createElement('div');
        produtoItem.classList.add('produto-item');
        produtoItem.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            <a href="#" class="btn">Adicionar ao carrinho</a>
        `;

        const addToCartBtn = produtoItem.querySelector('.btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            adicionarAoCarrinho(produto);
        });

        produtoLista.appendChild(produtoItem);
    });       
});
   
// Código para Slider
document.addEventListener('DOMContentLoaded', function() {
    const radios = document.querySelectorAll('input[name="btn-radio"]'); // Atualize aqui
    let currentIndex = 0;

    function autoSlide() {
        radios[currentIndex].checked = false; // Desmarca o botão atual
        currentIndex = (currentIndex + 1) % radios.length; // Incrementa o índice
        radios[currentIndex].checked = true; // Marca o próximo botão
    }

    setInterval(autoSlide, 5000); // Troca a cada 5 segundos
});


// Código para Menu (scripts/menu.js)
document.addEventListener('DOMContentLoaded', function() {
    const accountInfo = document.querySelector('.my_account_info');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    accountInfo.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Fecha o menu dropdown se clicar fora dele
    window.addEventListener('click', function(event) {
        if (!accountInfo.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});

// Código para Cookies (scripts/cookies.js)
document.addEventListener('DOMContentLoaded', function() {
    const cookiesMsg = document.getElementById('cookies-msg');
    const acceptCookiesButton = document.getElementById('accept-cookies');
    
    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', function() {
            cookiesMsg.style.display = 'none';
        });
    }
});

// Código para Modal  de login (scripts/modal.js)
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtn = document.getElementsByClassName('closeBtn')[0];

    // Função para abrir o modal
    function openModal(event) {
        event.preventDefault();
        modal.style.display = 'block';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    }

    // Função para alternar para o formulário de cadastro
    function showRegisterForm(event) {
        event.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }

    // Função para alternar para o formulário de login
    function showLoginForm(event) {
        event.preventDefault();
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', openModal);
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) {
        showRegister.addEventListener('click', showRegisterForm);
    }

    if (showLogin) {
        showLogin.addEventListener('click', showLoginForm);
    }
});
 
// Formulario de login
document.addEventListener("DOMContentLoaded", function() {
    
    // Função para abrir o modal
    function openModal() {
        document.getElementById('loginModal').style.display = 'block';
        document.body.classList.add('modal-open'); // Adiciona a classe modal-open ao body
    }

    // Função para fechar ambos os modais (login e redefinição de senha)
    function closeModal() {
        const loginModal = document.getElementById('loginModal');
        const resetPasswordModal = document.getElementById('resetPasswordModal');

        if (loginModal) {
            loginModal.style.display = 'none';
        }
        if (resetPasswordModal) {
            resetPasswordModal.style.display = 'none';
        }

        document.body.classList.remove('modal-open'); // Remove a classe modal-open ao fechar os modais
    }

    // Adiciona evento ao botão de fechar (X) em ambos os modais
    document.querySelectorAll('.closeBtn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Fecha o modal ao clicar fora da área de conteúdo do modal
    window.addEventListener('click', function(event) {
        const loginModal = document.getElementById('loginModal');
        const resetPasswordModal = document.getElementById('resetPasswordModal');

        if (event.target === loginModal || event.target === resetPasswordModal) {
            closeModal();
        }
    });

    // Função para criar o modal
    function createModal() {
        const modalContainer = document.getElementById('modalContainer');

        // Criando o elemento do modal
        const modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'modal';

        // Criando o conteúdo do modal
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'closeBtn';
        closeBtn.innerHTML = '&times;';
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';

        // Título principal do Login
        const title = document.createElement('h2');
        title.innerText = 'Login'; // Título principal

        // Formulário de Login
        const loginForm = document.createElement('div');
        loginForm.id = 'loginForm';
        loginForm.className = 'form-container';

        // Contêiner para o campo de Usuário com ícone
        const userContainer = document.createElement('div');
        userContainer.className = 'input-container';

        const loginLabelUser = document.createElement('label');
        loginLabelUser.setAttribute('for', 'username');
        loginLabelUser.innerText = 'Usuário:'; // Label para Usuário

        const userIcon = document.createElement('i');
        userIcon.className = 'bx bxs-user'; // Ícone de usuário da biblioteca Boxicons

        const loginInputUser = document.createElement('input');
        loginInputUser.type = 'text';
        loginInputUser.id = 'username';
        loginInputUser.name = 'username';
        loginInputUser.required = true; // Campo obrigatório
        loginInputUser.placeholder = 'Digite seu usuário';

        userContainer.appendChild(userIcon);
        userContainer.appendChild(loginInputUser);

        // Contêiner para o campo de Senha com ícone
        const passwordContainer = document.createElement('div');
        passwordContainer.className = 'input-container';

        const loginLabelPassword = document.createElement('label');
        loginLabelPassword.setAttribute('for', 'password');
        loginLabelPassword.innerText = 'Senha:'; // Label para Senha

        const passwordIcon = document.createElement('i');
        passwordIcon.className = 'bx bxs-lock'; // Ícone de cadeado da biblioteca Boxicons

        const loginInputPassword = document.createElement('input');
        loginInputPassword.type = 'password';
        loginInputPassword.id = 'password';
        loginInputPassword.name = 'password';
        loginInputPassword.required = true; // Campo obrigatório
        loginInputPassword.placeholder = 'Digite sua senha';

        passwordContainer.appendChild(passwordIcon);
        passwordContainer.appendChild(loginInputPassword);

        // Criar o link "Esqueci minha senha"
        const forgotPasswordLink = document.createElement('a');
        forgotPasswordLink.href = '#';
        forgotPasswordLink.innerText = 'Esqueci minha senha';
        forgotPasswordLink.addEventListener('click', function (event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            document.getElementById('resetPasswordModal').style.display = 'flex'; // Exibe o modal
        });

        // Função para redefinição de senha
    document.getElementById('savePasswordButton').addEventListener('click', function () {
        const email = document.getElementById('email').value;
        const confirmEmail = document.getElementById('confirmEmail').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validação dos campos
        if (!email || !confirmEmail || !newPassword || !confirmNewPassword) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (email !== confirmEmail) {
            alert('Os e-mails não correspondem.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert('As senhas não correspondem.');
            return;
        }

        if (newPassword.length < 6) {
            alert('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Exibe uma mensagem de sucesso (simulação de salvamento)
        alert('Sua senha foi redefinida com sucesso!');
        closeModal(); // Fecha o modal
    });

        // Botão de login
        const loginButton = document.createElement('button');
        loginButton.type = 'submit';
        loginButton.innerText = 'Entrar'; // Texto do botão de login

        // Informação sobre cadastro
        const registerInfo = document.createElement('div');
        
        // Adicionando os campos de login ao formulário
        loginForm.appendChild(loginLabelUser);
        loginForm.appendChild(userContainer); // Adiciona o contêiner com o ícone e campo de usuário
        loginForm.appendChild(loginLabelPassword);
        loginForm.appendChild(passwordContainer); // Adiciona o contêiner com o ícone e campo de senha
        loginForm.appendChild(forgotPasswordLink); // Adiciona link "Esqueci minha senha"
        loginForm.appendChild(loginButton);
        loginForm.appendChild(registerInfo); // Adiciona informação sobre cadastro

        // Adicionando formulários ao modal
        modalBody.appendChild(title); // Adiciona o título principal
        modalBody.appendChild(loginForm);
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        modalContainer.appendChild(modal);

        // Evento para fechar o modal
        closeBtn.addEventListener('click', closeModal);

        // Fechar o modal ao clicar fora dele
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                closeModal();
            }
        });
    }

    createModal();

    // Evento para abrir o modal
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', openModal);
});

document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('registerBtn');

    // Função para redirecionar para o formulário de cadastro
    function redirectToRegister(event) {
        event.preventDefault(); // Prevenir comportamento padrão
        window.location.href = 'formulario.html'; // Redireciona para a página de cadastro
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', redirectToRegister); // Evento de clique para redirecionamento
    }
});

// Obtém o botão
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Adiciona o evento de rolagem
window.onscroll = function() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight; // Altura total rolável
    const scrollPosition = window.scrollY || document.documentElement.scrollTop; // Posição atual da rolagem

    // Aparece o botão quando chega perto do fim da página, ajustando o valor de -200 conforme necessidade
    if (scrollPosition >= scrollableHeight - 750) { 
        scrollToTopBtn.style.display = "block";
        scrollToTopBtn.style.opacity = "1"; // Suavidade ao aparecer
    } else {
        scrollToTopBtn.style.display = "none";
        scrollToTopBtn.style.opacity = "0"; // Suavidade ao desaparecer
    }
};

// Ao clicar no botão, rola suavemente para o topo
scrollToTopBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

