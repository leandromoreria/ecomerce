// checkout.js

document.addEventListener('DOMContentLoaded', function() {
    carregarInformacoesDoCarrinho();
    carregarEndereco();
});

function carregarInformacoesDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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

        // Salva o subtotal no localStorage para usar na confirmação
        localStorage.setItem('subtotal', subtotal.toFixed(2));
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
        localStorage.setItem('metodoPagamento', 'cartao'); // Armazena o método de pagamento
    }
    
    function showPixForm() {
        document.getElementById('pix-form').classList.remove('hidden');
        document.getElementById('card-form').classList.add('hidden');
        localStorage.setItem('metodoPagamento', 'pix'); // Armazena o método de pagamento
    }
    

// Detecta a bandeira do cartão
function detectarBandeira(numeroCartao) {
    const bandeiraImagem = document.getElementById('card-flag');
    const cardNumberDisplay = document.getElementById('card-number-display');

    // Atualiza o número do cartão no cartão virtual
    cardNumberDisplay.textContent = numeroCartao; // Mostra o número completo

    const bandeiras = [
        { regex: /^4[0-9]{0,}/, imagem: 'cartoes/visa.png' }, // Visa
        { regex: /^5[1-5][0-9]{0,}/, imagem: 'cartoes/mastercard.png' }, // Mastercard
        { regex: /^3[47][0-9]{0,}/, imagem: 'cartoes/amex.png' }, // American Express
        { regex: /^4011[0-9]{0,}/, imagem: 'cartoes/elo.png' }, // Elo (exemplo)
    ];

    // Limpa a bandeira se o número for apagado
    if (numeroCartao.length === 0) {
        bandeiraImagem.style.display = 'none';
        bandeiraImagem.src = '';
        cardNumberDisplay.textContent = ''; // Limpa o display quando não há número
        return;
    }

    // Verifica as bandeiras
    const bandeira = bandeiras.find(b => b.regex.test(numeroCartao));
    if (bandeira) {
        bandeiraImagem.src = bandeira.imagem; // Caminho da imagem da bandeira
        bandeiraImagem.style.display = 'inline';
    } else {
        bandeiraImagem.style.display = 'none';
        bandeiraImagem.src = '';
    }
}

// Atualiza o nome do titular e a validade ao preencher
document.getElementById('cardholder').addEventListener('input', function() {
    document.getElementById('cardholder-name').textContent = this.value || 'Nome do Cartão';
});

document.getElementById('validade').addEventListener('input', function(e) {
    let input = e.target.value;

    // Remove caracteres inválidos
    input = input.replace(/[^0-9\/]/g, ''); 

 // Detecta se o usuário está apagando a barra junto com o mês
 if (input.length === 2 && e.inputType === 'deleteContentBackward') {
    input = input.substring(0, 1); // Permite apagar a barra junto com o mês
} else if (input.length === 2 && !input.includes('/')) {
    input = input + '/'; // Adiciona a barra após o segundo número
}

    e.target.value = input;
    document.getElementById('card-validade-display').textContent = input || 'MM/AA';

    if (input.length === 5) {
        const [mes, ano] = input.split('/');
        const anoAtual = new Date().getFullYear().toString().slice(2);

        if (parseInt(mes) < 1 || parseInt(mes) > 12) {
            alert('Mês inválido. Deve estar entre 01 e 12.');
            e.target.value = '';
            document.getElementById('card-validade-display').textContent = 'MM/AA';
        } else if (parseInt(ano) < parseInt(anoAtual)) {
            alert('Ano inválido. Deve ser igual ou maior que o atual.');
            e.target.value = '';
            document.getElementById('card-validade-display').textContent = 'MM/AA';
        }
    }
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
        } else {
            alert('Erro ao processar pagamento.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
    }
}

// Exemplo de chamada ao enviar o formulário
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const metodo = localStorage.getItem('metodoPagamento');
    const dados = metodo === 'cartao'
        ? {
            numero: document.getElementById('card-number').value,
            nome: document.getElementById('cardholder').value,
            validade: document.getElementById('validade').value,
            cvv: document.getElementById('cvv').value
        }
        : { chavePix: 'Chave do Pix' }; // Substituir pela chave real

    enviarDadosPagamento(metodo, dados);
});

    
    // Verificação do qrCode
function showPixForm() {
    document.getElementById('pix-form').classList.remove('hidden'); // Mostra o formulário do Pix
    document.getElementById('card-form').classList.add('hidden'); // Esconde o formulário do cartão
}

// Atribuição da chave Pix
function generatePix() {
    // Defina o link de pagamento e a chave Pix (CPF)
    const paymentLink = 'https://nubank.com.br/pagar/4d5h5/rJH800hpkD';
    const cpf = '38386620838'; // CPF que será incluído no QR Code

    // Combine o link de pagamento e o CPF em um formato que o Nubank aceite
    const qrCodeText = `${paymentLink}?cpf=${cpf}`; // Formato para gerar o QR Code

    // Gera o QR Code usando a biblioteca jQuery.qrcode
    $('#qrcode').empty(); // Limpa o container do QR Code existente

    // Gera o QR Code a partir do link de pagamento
    $('#qrcode').qrcode({
        text: qrCodeText, // Use o link de pagamento com CPF como texto do QR Code
        width: 128,
        height: 128
    });

    // Exibe o container e a chave Pix
    document.getElementById('pix-code').classList.remove('hidden'); // Mostra o código Pix gerado
    document.getElementById('pix-key').textContent = cpf; // Exibe o CPF como chave Pix

    // Enviar a chave Pix para o servidor Flask e MySQL
    sendPixKeyToServer(cpf);
}

// Função para enviar a chave Pix para o servidor Flask
function sendPixKeyToServer(cpf) {
    // Enviar a chave Pix para o Flask através de uma requisição POST
    fetch('/save_pix_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpf: cpf })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Chave Pix salva no servidor:', data);
    })
    .catch((error) => {
        console.error('Erro ao salvar a chave Pix:', error);
    });
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
function atualizarConfirmacao() {
    // Recupera o carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtosList = document.getElementById('final-products-list');
    const enderecoSalvo = localStorage.getItem('endereco');
    const metodoPagamento = localStorage.getItem('metodoPagamento');
    const subtotal = localStorage.getItem('subtotal');

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

        // Envia os dados para o backend Flask
        const data = {
            carrinho: carrinho,
            subtotal: subtotal,
            endereco: enderecoSalvo,
            metodoPagamento: metodoPagamento
        };

        fetch('/atualizar_confirmacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Exibe a mensagem de sucesso ou erro
        })
        .catch(error => {
            console.error('Erro ao enviar os dados para o servidor:', error);
        });
    }
    
        // Exibe o endereço salvo (ou um padrão, caso não tenha sido informado)
        const confirmationAddress = document.getElementById('confirmation-address');
        confirmationAddress.textContent = enderecoSalvo || 'Endereço não informado.';
    
        // Exibe o método de pagamento
        const confirmationPayment = document.getElementById('confirmation-payment');
        if (metodoPagamento) {
            confirmationPayment.textContent = metodoPagamento === 'cartao' ? 'Cartão de Crédito/Débito' : 'Pix';
        } else {
            confirmationPayment.textContent = 'Método de pagamento não selecionado.';
        }
    
        // Atualiza o total
        const finalTotalPrice = document.getElementById('final-total-price');
        finalTotalPrice.textContent = subtotal || '0.00';
    }
    
    // Envia as informações para o backend Flask
const data = {
    endereco: enderecoSalvo,
    metodoPagamento: metodoPagamento,
    subtotal: subtotal,
    pedidoId: localStorage.getItem('pedidoId')  // Presumindo que o ID do pedido esteja no localStorage
};

fetch('/atualizar_endereco_pagamento', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    alert(data.message);  // Exibe a mensagem de sucesso ou erro
})
.catch(error => {
    console.error('Erro ao enviar os dados para o servidor:', error);
});

    // Chama a função para atualizar as informações da confirmação antes de finalizar o pedido
function finalizarPedido() {
    // Verifica se os elementos necessários estão presentes
    const productsList = document.getElementById('products-list');
    const newAddressCheckbox = document.getElementById('new-address');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const confirmationAddress = document.getElementById('confirmation-address');
    const finalProductsList = document.getElementById('final-products-list');
    const finalTotalPrice = document.getElementById('final-total-price');

    if (!productsList || !confirmationAddress || !finalProductsList || !finalTotalPrice) {
        console.error("Um ou mais elementos necessários não foram encontrados.");
        return;
    }

    // Obtenha a lista de produtos e endereço conforme selecionado
    const produtos = productsList.innerHTML;
    const endereco = newAddressCheckbox && newAddressCheckbox.checked ? 
        `Rua: ${ruaInput.value}, Número: ${numeroInput.value}, Bairro: ${bairroInput.value}, CEP: ${cepInput.value}, Cidade: ${cidadeInput.value}` : 
        localStorage.getItem('endereco'); // Usa o endereço do localStorage

    const metodoPagamento = document.querySelector('input[name="payment"]:checked')?.id;

    // Armazena o endereço no localStorage para futuras referências
    if (newAddressCheckbox && newAddressCheckbox.checked) {
        localStorage.setItem('endereco', endereco);
    }

    // Atualiza a confirmação com os dados do pedido
    finalProductsList.innerHTML = produtos; // Certifique-se de que 'produtos' contém a informação correta
    confirmationAddress.textContent = endereco; // O endereço deve estar definido
    finalTotalPrice.textContent = localStorage.getItem('subtotal'); // Certifique-se de que o subtotal está salvo corretamente

    // Salve informações necessárias para o acompanhamento do pedido (se necessário)
    localStorage.setItem('pedidoFinalizado', JSON.stringify({
        produtos: produtos,
        endereco: endereco,
        subtotal: localStorage.getItem('subtotal')
    }));

    // Cria o objeto com os dados que serão enviados para o Flask
    const data = {
        produtos: produtos,
        endereco: endereco,
        metodoPagamento: metodoPagamento,
        subtotal: localStorage.getItem('subtotal'),
        pedidoId: localStorage.getItem('pedidoId')  // Presumindo que o ID do pedido esteja no localStorage
    };

    // Envia as informações para o backend Flask
    fetch('/finalizar_pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Compra finalizada com sucesso!');  // Mensagem de sucesso ao usuário
        nextStep();  // Passa para a próxima etapa do pedido
    })
    .catch(error => {
        console.error('Erro ao enviar os dados para o servidor:', error);
        alert('Ocorreu um erro ao finalizar a compra. Tente novamente.');
    });
}

    // Finaliza a compra
document.getElementById('finalizar-compra').addEventListener('click', function() {
    // Coleta as informações do pedido, como produtos, endereço, método de pagamento, e subtotal
    const produtos = JSON.parse(localStorage.getItem('carrinho')) || [];  // Exemplo, pegue os dados do carrinho
    const endereco = localStorage.getItem('endereco') || 'Endereço não informado';  // Endereço do localStorage
    const metodoPagamento = document.querySelector('input[name="payment"]:checked')?.id || 'Não informado';  // Método de pagamento
    const subtotal = localStorage.getItem('subtotal') || '0.00';  // Subtotal do localStorage

    // Cria o objeto com os dados que serão enviados para o Flask
    const data = {
        produtos: produtos,
        endereco: endereco,
        metodoPagamento: metodoPagamento,
        subtotal: subtotal,
        pedidoId: localStorage.getItem('pedidoId')  // ID do pedido no localStorage
    };

    // Envia as informações do pedido para o backend Flask para armazenamento no banco de dados
    fetch('/finalizar_pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pedido finalizado com sucesso:', data);
        alert('Compra finalizada com sucesso!');
        // Chama a função de upload da NF-e
        finalizarCompra();
    })
    .catch(error => {
        console.error('Erro ao enviar os dados para o servidor:', error);
        alert('Ocorreu um erro ao finalizar a compra. Tente novamente.');
    });

    // Redireciona para a página principal do site
    window.location.href = 'index.html'; // Substitua 'index.html' pela URL desejada
});

// Função para finalizar a compra e enviar a NF-e para o servidor
function finalizarCompra() {
    // Simulação de NF-e gerada (substitua isso com sua lógica para gerar a NF-e)
    const nfeFile = new File(["<xml da NF-e>"], "nota-fiscal.xml", { type: "application/xml" });

    // Aqui você faria o upload da NF-e para o servidor
    const formData = new FormData();
    formData.append('nfe', nfeFile);
    
    // Envio para o servidor (exemplo usando fetch)
    fetch('/api/upload-nfe', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('NF-e enviada com sucesso:', data);
        // Aqui você pode redirecionar o usuário para uma página de sucesso
    })
    .catch(error => {
        console.error('Erro ao enviar a NF-e:', error);
    });
}
