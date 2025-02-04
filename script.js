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
                nome: 'Bolsa Artemis',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 200.00,
                imagem: ['bolsas/Bolsa Artemis 1.png', 'bolsas/Bolsa Artemis 2.png']
            },
            {
                nome: 'Bolsa Bali',
                descricao: 'Peça confeccionada em fio de malha com alça e ferragens douradas, versátil e elegante',
                preco: 249.00,
                imagem: ['bolsas/Bolsa Bali 1.png', 'bolsas/Bolsa Bali 2.png']
            },
            {
                nome: 'Bolsa Carmem', 
                descricao: 'Peça confeccionada em fio de malha com 2 alças, uma em couro sintético e ferragens douradas versátil para todas as ocasiões',
                preco: 279.00,
                imagem: ['bolsas/Bolsa Carmem 1.png', 'bolsas/Bolsa Carmem 2.png']
            },
            {
                nome: 'Bolsa e Carteira Barbie',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 249.00,
                imagem: ['bolsas/Bolsa Carteira Barbie 1.png', 'bolsas/Bolsa Carteira Barbie 2.png']
            },
            {
                nome: 'Bolsa Drika',
                descricao: 'Peça confeccionada em fio de malha e base em couro sintético com fecho de níquel',
                preco: 250.00,
                imagem: ['bolsas/Bolsa Drika 1.png', 'bolsas/Bolsa Drika 2.png']
            },
            {
                nome: 'Bolsa Florença',
                descricao: 'Peça confeccionada em fio náutico e ferragens dourada, espaçosa e elegante',
                preco: 219.00,
                imagem: ['bolsas/Bolsa Florença 1.png', 'bolsas/Bolsa Florença 2.png']
            },
            {
                nome: 'Bolsa Flores',
                descricao: 'Peça confeccionada em fio náutico e ferragens em níquel para mulheres ousadas',
                preco: 239.00,
                imagem: ['bolsas/Bolsa Flores 1.png', 'bolsas/Bolsa Flores 2.png']
            },
            {
                nome: 'Bolsa Isis',
                descricao: 'Peça confeccionada em fio de malha com alã em madeira',
                preco: 129.00,
                imagem: ['bolsas/Bolsa Isis 1.png', 'bolsas/Bolsa Isis 2.png']
            },
            {
                nome: 'Bolsa Lola',
                descricao: 'Peça confeccionada em fio de malha, alças de couro sintético e ferragens douradas',
                preco: 269.00,
                imagem: ['bolsas/Bolsa Lola 1.png', 'bolsas/Bolsa Lola 2.png']
            },
            {
                nome: 'Bolsa Lorena',
                descricao: 'Peça confeccionada em fio náutico com alto brilho e fecho dourado',
                preco: 280.00,
                imagem: ['bolsas/Bolsa Lorena 1.png', 'bolsas/Bolsa Lorena 2.png']
            },
            {
                nome: 'Bolsa Magnólia',
                descricao: 'Peça confeccionada em fio de malha com alça versáil em ferragens douradas',
                preco: 319.00,
                imagem: ['bolsas/Bolsa Magnólia 1.png', 'bolsas/Bolsa Magnólia 2.png']
            },
            {
                nome: 'Bolsa Maia',
                descricao: 'Peça confeccionada em fio náutico com duas alças de mão e uma tira color ferragens em níquel para mulheres elegantes e versáteis',
                preco: 329.00,
                imagem: ['bolsas/Bolsa Maia 1.png', 'bolsas/Bolsa Maia 2.png']
            },
            {
                nome: 'Bolsa Margarida',
                descricao: 'Peça confeccionada em fio de malha, com fecho da vovó e ferragens de níquel com três tipos de alça',
                preco: 290.00,
                imagem: ['bolsas/Bolsa Margarida 1.png', 'bolsas/Bolsa Margarida 2.png']
            },
            {
                nome: 'Bolsa Meg',
                descricao: 'Peça confeccionada em fio de malha com alça de mão em couro sintético e ferragens douradas',
                preco: 260.00,
                imagem: ['bolsas/Bolsa Meg 1.png', 'bolsas/Bolsa Meg 2.png']
            },
            {
                nome: 'Bolsa Megan',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Megan 1.png', 'bolsas/Bolsa Megan 2.png']
            },
            {
                nome: 'Bolsa Mini linha Encanto',
                descricao: 'Peça confeccionada em fio náutico e ferragens douradas',
                preco: 170.00,
                imagem: ['bolsas/Bolsa Mini Linha Encanto 1.png', 'bolsas/Bolsa Mini Linha Encanto 2.png']
            },
            {
                nome: 'Bolsa Miranda',
                descricao: 'Peça confeccionada em fio em pelos com fecho da vovó e ferragens em níquel para ocasiões especiais',
                preco: 259.00,
                imagem: ['bolsas/Bolsa Miranda 1.png', 'bolsas/Bolsa Miranda 2.png']
            },
            {
                nome: 'Bolsa Olivia',
                descricao: 'Peça confeccionada em fio náutico com alça de madeira e ferragens douradas',
                preco: 200.00,
                imagem: ['bolsas/Bolsa Olivia 1.png', 'bolsas/Bolsa Olivia 2.png']
            },
            {
                nome: 'Bolsa Pamela',
                descricao: 'Peça confeccionada em fio de malha com aba base e alça em couro sintético, com ferragens douradas para todas as ocasiões',
                preco: 229.00,
                imagem: ['bolsas/Bolsa Pamela 1.png', 'bolsas/Bolsa Pamela 2.png']
            },
            {
                nome: 'Bolsa Paris',
                descricao: 'Peça confeccionada em fio náutico e alça de madeira com estilo e ousadia',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Paris 1.png', 'bolsas/Bolsa Paris 2.png']
            },
            {
                nome: 'Bolsa Praia',
                descricao: 'Peça confeccionada em fio náutico.',
                preco: 159.00,
                imagem: ['bolsas/Bolsa Praia 1.png', 'bolsas/Bolsa Praia 2.png']
            },
            {
                nome: 'Carteira Linha Encanto',
                descricao: 'Peça confeccionada em fio náutico com laça de níquel',
                preco: 99.00,
                imagem: ['bolsas/Carteira Linha Encanto.png']
            },
            {
                nome: 'Carteira Luna',
                descricao: 'Peça confeccionada em cordão de algodão e bordado',
                preco: 149.00,
                imagem: ['bolsas/Carteira Luna 1.png', 'bolsas/Carteira Luna 2.png']
            },
            {
                nome: 'Mateira e Porta Vinho',
                descricao: 'Peça confeccionada em fio de malha com aba e alça em couro sintético, com base e divisor em acrilíco',
                preco: 329.00,
                imagem: ['bolsas/Mateira e Porta Vinho 1.png', 'bolsas/Mateira e Porta Vinho 2.png']
            },
            {
                nome: 'Bolsa Riviera',
                descricao: 'Peça confeccionada em fio náutico e ferragens douradas para todas as ocasiões',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Riviera 1.png',' bolsas/Bolsa Riviera 2.png']
            },
            {
                nome: 'Bolsa Melani',
                descricao: 'Peça confeccionada em fio náutico com duas alças e ferragens douradas para mulheres estilosas',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Melani 1.png',' bolsas/Bolsa Melani 2.png']
            },
            
            // Adicione mais produtos conforme necessário
        ];
    
        let carrinho = [];
        const produtoLista = document.querySelector('.produtos-lista');
    
        produtos.forEach((produto, index) => {
            const produtoItem = document.createElement('div');
            produtoItem.classList.add('produto-item');
            produtoItem.innerHTML = `
                <div class="slider">
                    <button class="prev" onclick="mudarImagem(${index}, -1)">&#10094;</button>
                    <img src="${produto.imagem[0]}" alt="${produto.nome}" id="imagem-${index}">
                    <button class="next" onclick="mudarImagem(${index}, 1)">&#10095;</button>
                </div>
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
    
        const indicesImagens = new Array(produtos.length).fill(0);
    
        window.mudarImagem = function(index, direcao) {
            const produto = produtos[index];
            if (produto.imagem.length > 1) {
                indicesImagens[index] = (indicesImagens[index] + direcao + produto.imagem.length) % produto.imagem.length;
                document.getElementById(`imagem-${index}`).src = produto.imagem[indicesImagens[index]];
            }
        };
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

        // Função para processar o login (segundo trecho)
async function handleLogin(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores dos inputs de login
    const username = document.getElementById('username').value.trim;
    const password = document.getElementById('password').value.trim;

    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        // Envia os dados para o servidor
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido
            const { name } = data; // Supondo que a API retorne o nome do usuário
            localStorage.setItem('userName', data.name); // Salva o nome do usuário no localStorage
            alert(`Bem-vindo(a), ${data.name}!`);
            window.location.href = 'index.html'; // Redireciona para a página principal
        } else {
            // Exibe a mensagem de erro retornada pela API
            alert(data.message || 'Erro ao realizar login. Verifique suas credenciais.');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        alert('Ocorreu um erro ao processar seu login. Tente novamente mais tarde.');
    }
}

// Após criar o formulário, registre o evento de submit
function createLoginForm() {
    const loginForm = document.createElement('form');
    loginForm.id = 'loginForm';
    loginForm.className = 'form-container';

    // Campos e botão omitidos por brevidade...
    
    const loginButton = document.createElement('button');
    loginButton.type = 'submit'; // Botão de envio do formulário
    loginButton.innerText = 'Entrar';

    loginForm.appendChild(loginButton);

    // Registra o evento de envio do formulário
    loginForm.addEventListener('submit', handleLogin);

    return loginForm;
}

// Configuração do evento de envio do formulário de login
loginForm.addEventListener('submit', handleLogin);

        // Criar o link "Esqueci minha senha"
        const forgotPasswordLink = document.createElement('a');
        forgotPasswordLink.href = '#';
        forgotPasswordLink.innerText = 'Esqueci minha senha';
        forgotPasswordLink.addEventListener('click', function (event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            document.getElementById('resetPasswordModal').style.display = 'flex'; // Exibe o modal
        });

        // Verifica se o usuário está logado
window.onload = function() {
    const userName = localStorage.getItem('userName'); // Obtém o nome do usuário do localStorage

    if (userName) {
        // Exibe o nome do usuário e as opções de logout
        document.getElementById('userGreeting').textContent = `Olá, ${userName}!`;
        document.getElementById('loginBtn').style.display = 'none'; // Esconde o botão "Entrar"
        document.getElementById('registerBtn').style.display = 'none'; // Esconde o botão "Cadastre-se"
        document.getElementById('logoutBtn').style.display = 'inline'; // Mostra o botão "Sair"
    }

    // Função de logout
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('userName'); // Remove o nome do usuário do localStorage
        window.location.href = 'index.html'; // Redireciona para a página inicial
    });
};

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

// Ao clicar no botão, rola suavemente para o topo
scrollToTopBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

