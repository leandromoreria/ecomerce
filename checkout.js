document.addEventListener('DOMContentLoaded', function () {
    carregarInformacoesDoCarrinho();
    carregarEndereco();
});

async function carregarInformacoesDoCarrinho() {
    try {
        const response = await fetch('/api/carrinho'); // Chamada para buscar o carrinho do backend
        const carrinho = await response.json();

        const produtosList = document.getElementById('products-list');
        const totalPriceElement = document.getElementById('total-price');
        let subtotal = 0;

        produtosList.innerHTML = ''; // Limpa a lista

        if (carrinho.length === 0) {
            produtosList.innerHTML = '<p>O carrinho está vazio.</p>';
        } else {
            carrinho.forEach(item => {
                const totalItem = item.preco * item.quantidade;
                subtotal += totalItem;

                const produtoDiv = document.createElement('div');
                produtoDiv.innerHTML = `
                    <div class="product">
                        <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: auto;" />
                        <div class="info">
                            <div class="name">${item.nome}</div>
                            <div class="category">${item.descricao}</div>
                            <div class="quantity">Quantidade: ${item.quantidade}</div>
                            <div class="total">Total: R$ ${totalItem.toFixed(2)}</div>
                        </div>
                    </div>
                `;
                produtosList.appendChild(produtoDiv);
            });

            // Atualiza o total na página
            totalPriceElement.textContent = subtotal.toFixed(2);

            // Envia o subtotal para o backend
            await fetch('/api/carrinho/subtotal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subtotal }),
            });
        }
    } catch (error) {
        console.error('Erro ao carregar informações do carrinho:', error);
    }
}

async function carregarEndereco() {
    try {
        const response = await fetch('/api/endereco'); // Busca o endereço do backend
        const endereco = await response.json();

        const existingAddress = document.getElementById('existing-address');
        if (endereco) {
            existingAddress.innerHTML = `
                <p>${endereco.rua}, ${endereco.numero} - ${endereco.bairro}</p>
                <p>${endereco.cidade} - ${endereco.estado}, ${endereco.cep}</p>
            `;
        } else {
            existingAddress.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar endereço:', error);
    }
}

let currentStep = 0; // Variável para rastrear o passo atual
const steps = document.querySelectorAll('.checkout-step');

function nextStep() {
    if (currentStep < steps.length - 1) {
        steps[currentStep].classList.add('hidden'); // Oculta o passo atual
        currentStep++; // Avança para o próximo passo
        steps[currentStep].classList.remove('hidden'); // Mostra o próximo passo
        atualizarPassoNaLinhaDoTempo();
        atualizarConfirmacao();
    }
}

function prevStep() {
    if (currentStep > 0) {
        steps[currentStep].classList.add('hidden'); // Oculta o passo atual
        currentStep--; // Volta para o passo anterior
        steps[currentStep].classList.remove('hidden'); // Mostra o passo anterior
        atualizarPassoNaLinhaDoTempo();
    }
}

function atualizarPassoNaLinhaDoTempo() {
    const timelineSteps = document.querySelectorAll('.step');
    timelineSteps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep) {
            step.classList.add('active'); // Adiciona a classe 'active' ao passo atual
        }
    });
}

function toggleAddressFields() {
    const newAddressFields = document.getElementById('new-address-fields');
    const existingAddress = document.getElementById('existing-address');

    if (document.getElementById('new-address').checked) {
        newAddressFields.classList.remove('hidden'); // Mostra campos para novo endereço
        existingAddress.classList.add('hidden'); // Esconde o endereço existente
    } else {
        newAddressFields.classList.add('hidden'); // Esconde campos para novo endereço
        existingAddress.classList.remove('hidden'); // Mostra o endereço existente
    }
}

    // Função para enviar os dados do carrinho ao servidor
async function enviarDadosParaServidor() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const subtotal = localStorage.getItem('subtotal') || 0;
    const endereco = document.getElementById('confirmation-address').textContent;
    const metodoPagamento = localStorage.getItem('metodoPagamento');

    const payload = {
        carrinho,
        subtotal,
        endereco,
        metodoPagamento
    };

    try {
        const response = await fetch('/api/finalizar-pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const resultado = await response.json();
            alert('Pedido finalizado com sucesso!');
            console.log(resultado);
        } else {
            alert('Erro ao finalizar pedido. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        alert('Erro de conexão com o servidor.');
    }
}

   // Verifica se já existe um endereço salvo no banco de dados
function carregarEndereco() {
    fetch('/api/carregar-endereco', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar o endereço.');
        }
        return response.json();
    })
    .then(data => {
        if (data.endereco) {
            document.getElementById('registered-address').textContent = data.endereco;
        } else {
            document.getElementById('registered-address').textContent = 'Nenhum endereço cadastrado.';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('registered-address').textContent = 'Erro ao carregar o endereço.';
    });
}

    // Alterna entre os formulários de Cartão e Pix
function showCardForm() {
    document.getElementById('card-form').classList.remove('hidden');
    document.getElementById('pix-form').classList.add('hidden');
}

function showPixForm() {
    document.getElementById('pix-form').classList.remove('hidden');
    document.getElementById('card-form').classList.add('hidden');
}

// Detecta a bandeira do cartão
function detectarBandeira(numeroCartao) {
    const bandeiraImagem = document.getElementById('card-flag');
    const cardNumberDisplay = document.getElementById('card-number-display');
    cardNumberDisplay.textContent = numeroCartao || '**** **** **** ****';

    const bandeiras = [
        { regex: /^4[0-9]{0,}/, imagem: 'cartoes/visa.png' }, // Visa
        { regex: /^5[1-5][0-9]{0,}/, imagem: 'cartoes/mastercard.png' }, // Mastercard
        { regex: /^3[47][0-9]{0,}/, imagem: 'cartoes/amex.png' }, // American Express
        { regex: /^4011[0-9]{0,}/, imagem: 'cartoes/elo.png' }, // Elo
    ];

    if (numeroCartao.length === 0) {
        bandeiraImagem.style.display = 'none';
        bandeiraImagem.src = '';
        return;
    }

    const bandeira = bandeiras.find(b => b.regex.test(numeroCartao));
    if (bandeira) {
        bandeiraImagem.src = bandeira.imagem;
        bandeiraImagem.style.display = 'inline';
    } else {
        bandeiraImagem.style.display = 'none';
        bandeiraImagem.src = '';
    }
}

// Atualiza o nome do titular e validade no cartão virtual
document.getElementById('cardholder').addEventListener('input', function () {
    document.getElementById('cardholder-name').textContent = this.value || 'Nome do Cartão';
});

document.getElementById('validade').addEventListener('input', function (e) {
    let input = e.target.value.replace(/[^0-9\/]/g, '');

    if (input.length === 2 && !input.includes('/')) {
        input = input + '/';
    }

    e.target.value = input;
    document.getElementById('card-validade-display').textContent = input || 'MM/AA';
});

// Envia informações ao backend
async function enviarDadosPagamento(metodo, dados) {
    try {
        const response = await fetch('/processar_pagamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ metodo, dados })
        });

        const resultado = await response.json();
        if (resultado.sucesso) {
            alert('Pagamento processado com sucesso!');
            window.location.href = '/confirmacao_pedido'; // Redireciona para confirmação
        } else {
            alert('Erro ao processar pagamento: ' + resultado.mensagem);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
}

// Submissão do formulário de pagamento
document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const metodo = document.querySelector('input[name="metodo"]:checked').value;
    const dados = metodo === 'cartao'
        ? {
            numero: document.getElementById('card-number').value,
            nome: document.getElementById('cardholder').value,
            validade: document.getElementById('validade').value,
            cvv: document.getElementById('cvv').value
        }
        : { chavePix: document.getElementById('pix-key').textContent };

    enviarDadosPagamento(metodo, dados);
});

// Gera o QR Code Pix
function generatePix() {
    const cpf = '38386620838';
    const qrCodeText = `https://nubank.com.br/pagar/4d5h5/rJH800hpkD?cpf=${cpf}`;

    $('#qrcode').empty();
    $('#qrcode').qrcode({
        text: qrCodeText,
        width: 128,
        height: 128
    });

    document.getElementById('pix-code').classList.remove('hidden');
    document.getElementById('pix-key').textContent = cpf;

    sendPixKeyToServer(cpf);
}

// Envia a chave Pix para o backend
async function sendPixKeyToServer(cpf) {
    try {
        const response = await fetch('/save_pix_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf })
        });

        const resultado = await response.json();
        console.log('Chave Pix salva no servidor:', resultado);
    } catch (error) {
        console.error('Erro ao salvar a chave Pix:', error);
    }
}

// Copia a chave Pix para a área de transferência
function copyPix() {
    const pixKey = document.getElementById('pix-key').textContent;
    navigator.clipboard.writeText(pixKey)
        .then(() => {
            alert('Chave Pix copiada com sucesso: ' + pixKey);
        })
        .catch(err => {
            console.error('Erro ao copiar a chave Pix:', err);
        });
}

   // Atualiza a confirmação
async function atualizarConfirmacao() {
    // Recupera o carrinho do backend
    try {
        const response = await fetch('/api/carrinho');
        if (!response.ok) throw new Error('Erro ao obter o carrinho do servidor');
        const carrinho = await response.json();

        const produtosList = document.getElementById('final-products-list');
        const responseDados = await fetch('/api/dados_confirmacao');
        if (!responseDados.ok) throw new Error('Erro ao obter os dados de confirmação');
        const { endereco, metodoPagamento, subtotal } = await responseDados.json();

        // Limpa a lista de produtos para garantir que será preenchida corretamente
        produtosList.innerHTML = '';

        if (carrinho.length === 0) {
            produtosList.innerHTML = '<p>Não há produtos no carrinho.</p>';
        } else {
            carrinho.forEach(item => {
                const totalItem = item.preco * item.quantidade;

                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('product');

                produtoDiv.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: auto;" />
                    <div class="info">
                        <div class="name">${item.nome}</div>
                        <div class="quantity">Quantidade: ${item.quantidade}</div>
                        <div class="total">Total: R$ ${totalItem.toFixed(2)}</div>
                    </div>
                `;

                produtosList.appendChild(produtoDiv);
            });

            // Exibe o endereço salvo
            const confirmationAddress = document.getElementById('confirmation-address');
            confirmationAddress.textContent = endereco || 'Endereço não informado.';

            // Exibe o método de pagamento
            const confirmationPayment = document.getElementById('confirmation-payment');
            confirmationPayment.textContent =
                metodoPagamento === 'cartao' ? 'Cartão de Crédito/Débito' : 'Pix';

            // Atualiza o total
            const finalTotalPrice = document.getElementById('final-total-price');
            finalTotalPrice.textContent = subtotal || '0.00';
        }
    } catch (error) {
        console.error('Erro ao atualizar a confirmação:', error);
    }
}

// Função para finalizar o pedido
async function finalizarPedido() {
    try {
        // Verifica se os elementos necessários estão presentes
        const newAddressCheckbox = document.getElementById('new-address');
        const ruaInput = document.getElementById('rua');
        const numeroInput = document.getElementById('numero');
        const bairroInput = document.getElementById('bairro');
        const cepInput = document.getElementById('cep');
        const cidadeInput = document.getElementById('cidade');
        const confirmationAddress = document.getElementById('confirmation-address');

        // Define o endereço a ser enviado
        const endereco =
            newAddressCheckbox && newAddressCheckbox.checked
                ? `Rua: ${ruaInput.value}, Número: ${numeroInput.value}, Bairro: ${bairroInput.value}, CEP: ${cepInput.value}, Cidade: ${cidadeInput.value}`
                : confirmationAddress.textContent;

        // Define o método de pagamento
        const metodoPagamento = document.querySelector('input[name="payment"]:checked')?.id;

        // Cria o objeto com os dados que serão enviados para o Flask
        const data = {
            endereco: endereco,
            metodoPagamento: metodoPagamento,
        };

        // Envia as informações para o backend
        const response = await fetch('/api/finalizar_pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Erro ao finalizar o pedido');

        const result = await response.json();
        alert('Compra finalizada com sucesso! Pedido ID: ' + result.pedidoId);
        window.location.href = '/pagina_confirmacao'; // Redireciona para a página de confirmação
    } catch (error) {
        console.error('Erro ao finalizar o pedido:', error);
        alert('Ocorreu um erro ao finalizar a compra. Tente novamente.');
    }
}

// Chama a função para atualizar as informações da confirmação
document.addEventListener('DOMContentLoaded', () => {
    atualizarConfirmacao();
});

   // Finaliza a compra
document.getElementById('finalizar-compra').addEventListener('click', async function () {
    try {
        // Coleta as informações do pedido
        const produtos = JSON.parse(localStorage.getItem('carrinho')) || [];  // Produtos do carrinho
        const endereco = document.getElementById('endereco-input')?.value || 'Endereço não informado';  // Endereço informado pelo cliente
        const metodoPagamento = document.querySelector('input[name="payment"]:checked')?.value || 'Não informado';  // Método de pagamento escolhido
        const subtotal = produtos.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2); // Calcula o subtotal baseado nos produtos

        // Verifica se os campos obrigatórios estão preenchidos
        if (!produtos.length) {
            alert('O carrinho está vazio! Adicione produtos antes de finalizar a compra.');
            return;
        }
        if (endereco === 'Endereço não informado') {
            alert('Informe um endereço válido para entrega.');
            return;
        }
        if (metodoPagamento === 'Não informado') {
            alert('Selecione um método de pagamento.');
            return;
        }

        // Cria o objeto com os dados do pedido
        const data = {
            produtos: produtos,
            endereco: endereco,
            metodoPagamento: metodoPagamento,
            subtotal: subtotal,
            pedidoId: new Date().getTime() // Gera um ID único para o pedido
        };

        // Envia as informações do pedido para o backend
        const response = await fetch('/finalizar_pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar os dados para o servidor. Verifique sua conexão.');
        }

        const result = await response.json();
        console.log('Pedido finalizado com sucesso:', result);
        alert('Compra finalizada com sucesso!');

        // Chama a função para enviar a NF-e
        await enviarNotaFiscal(data.pedidoId);

        // Redireciona para a página principal
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
        alert('Ocorreu um erro ao finalizar a compra. Tente novamente.');
    }
});

// Função para gerar e enviar a NF-e para o servidor
async function enviarNotaFiscal(pedidoId) {
    try {
        // Simulação de geração de NF-e (substitua isso pela lógica real do backend para gerar a NF-e)
        const nfeContent = `<nfe><id>${pedidoId}</id><status>aprovado</status></nfe>`;
        const nfeFile = new File([nfeContent], `nota-fiscal-${pedidoId}.xml`, { type: 'application/xml' });

        // Envia a NF-e para o servidor
        const formData = new FormData();
        formData.append('nfe', nfeFile);

        const response = await fetch('/api/upload-nfe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar a NF-e.');
        }

        const result = await response.json();
        console.log('NF-e enviada com sucesso:', result);
    } catch (error) {
        console.error('Erro ao enviar a NF-e:', error);
    }
}
