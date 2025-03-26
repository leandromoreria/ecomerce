// Função para carregar e exibir os produtos no carrinho
async function carregarCarrinho() {
    try {
        const response = await fetch('http://localhost:5503/api/carrinho', { // Alterar para um esquema de protocolo suportado
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar o carrinho');
        }

        const carrinho = await response.json();
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de adicionar os itens

        if (carrinho.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">O carrinho está vazio.</td></tr>';
        } else {
            carrinho.forEach((item, index) => {
                const linha = document.createElement('tr');
                
                linha.innerHTML = `
                    <td>
                        <div class="product">
                            <img src="${item.imagem}" alt="${item.nome}" />
                            <div class="info">
                                <div class="name">${item.nome}</div>
                                <div class="category">${item.descricao}</div>
                            </div>
                        </div>
                    </td>
                    <td>R$ ${item.preco.toFixed(2)}</td>
                    <td>
                        <div class="qty">
                            <button class="btn-quantidade" data-index="${index}" data-action="diminuir"><i class="bx bx-minus"></i></button>
                            <span>${item.quantidade}</span>
                            <button class="btn-quantidade" data-index="${index}" data-action="aumentar"><i class="bx bx-plus"></i></button>
                        </div>
                    </td>
                    <td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
                    <td>
                        <button class="remove" data-index="${index}"><i class="bx bx-x"></i></button>
                    </td>
                `;
                tbody.appendChild(linha);
            });
        }

        // Chama a função para atualizar o total
        await atualizarTotal();
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        alert('Ocorreu um erro ao carregar o carrinho. Por favor, tente novamente.');
    }
}

// Função para atualizar o subtotal e total do carrinho
async function atualizarTotal() {
    try {
        const response = await fetch('http://localhost:3000/api/carrinho', { // Alterar para um esquema de protocolo suportado
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar total');
        }

        const carrinho = await response.json();
        let subtotal = 0;

        carrinho.forEach(item => {
            subtotal += item.preco * item.quantidade;
        });

        const subtotalElement = document.querySelector('.info div:nth-child(1) span:last-child');
        const totalElement = document.querySelector('footer span:last-child');
        
        if (subtotalElement && totalElement) {
            subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
            totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        } else {
            throw new Error('Elementos de total não encontrados');
        }
    } catch (error) {
        console.error('Erro ao atualizar total:', error);
    }
}

// Função para manipular a quantidade e remoção dos produtos
async function manipularCarrinho() {
    document.querySelector('tbody').addEventListener('click', async function(e) {
        try {
            const button = e.target.closest('button');
            if (!button) return;

            const index = button.dataset.index;
            const action = button.dataset.action;
            const isRemove = button.classList.contains('remove');
            const method = isRemove ? 'DELETE' : 'PATCH';

            if (button.classList.contains('btn-quantidade') || isRemove) {
                const response = await fetch('http://localhost:3000/api/carrinho/' + index, { // Alterar para um esquema de protocolo suportado
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: method === 'PATCH' ? JSON.stringify({ action }) : null
                });

                if (!response.ok) {
                    throw new Error('Erro ao atualizar carrinho');
                }

                await carregarCarrinho();
            }
        } catch (error) {
            console.error('Erro ao manipular carrinho:', error);
            alert('Ocorreu um erro ao atualizar o carrinho. Por favor, tente novamente.');
        }
    });
}

// Função para redirecionar para a página de checkout
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length > 0) {
        window.location.href = 'checkout.html'; // Altere 'checkout.html' para o caminho correto do seu HTML de checkout
    } else {
        alert('O carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    }
}

// Função para calcular o frete
async function calcularFrete() {
    try {
        const cepDestino = document.getElementById('cep').value.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        if (!cepDestino || cepDestino.length !== 8) {
            throw new Error('CEP inválido');
        }

        // Dados necessários para o cálculo do frete
        const cepOrigem = "16201-169"; // CEP da sua empresa
        const peso = 2; // Peso do pacote em kg
        const comprimento = 20; // Comprimento em cm
        const altura = 10; // Altura em cm
        const largura = 15; // Largura em cm
        const servico = "04014"; // Código Sedex

        // Agora você pode chamar a API dos Correios ou de outra transportadora para calcular o frete
        const response = await fetch(`https://api.correios.com.br/frete?cepOrigem=${cepOrigem}&cepDestino=${cepDestino}&peso=${peso}&comprimento=${comprimento}&altura=${altura}&largura=${largura}&servico=${servico}`);
        
        if (!response.ok) {
            throw new Error('Erro ao calcular frete');
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        
        const valor = xmlDoc.getElementsByTagName("Valor")[0]?.childNodes[0]?.nodeValue || "Indisponível";
        const prazo = xmlDoc.getElementsByTagName("PrazoEntrega")[0]?.childNodes[0]?.nodeValue || "Desconhecido";

        document.getElementById("resultadoFrete").innerText = `Frete: R$ ${valor} | Prazo: ${prazo} dias úteis`;
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        document.getElementById("resultadoFrete").innerText = "Erro ao calcular o frete.";
        alert('CEP inválido. Digite um CEP válido para calcular o frete.');
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await carregarCarrinho();
        manipularCarrinho();
        
        const finalizarCompraBtn = document.querySelector('.finalizar-compra');
        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', finalizarCompra);
        }

        // Configuração do cálculo de frete
        const calcularFreteBtn = document.getElementById('calcularFrete');
        if (calcularFreteBtn) {
            calcularFreteBtn.addEventListener('click', calcularFrete);
        }

        // Configuração do cupom de desconto
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total');
        const couponInput = document.getElementById('couponCode');
        const applyCouponButton = document.getElementById('applyCouponButton');

        if (couponInput && applyCouponButton) {
            couponInput.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
            });

            applyCouponButton.addEventListener('click', function() {
                const couponCode = couponInput.value.trim();
                if (!couponCode) return;

                const coupons = {
                    'DESCONTO10': 0.10,
                    'DESCONTO20': 0.20,
                    'FRETEGRATIS': 5.00
                };

                const subtotal = parseFloat(subtotalElement.textContent.replace('R$ ', '').replace(',', '.'));
                
                if (coupons[couponCode]) {
                    const discount = coupons[couponCode];
                    const discountAmount = discount < 1 ? subtotal * discount : discount;
                    const total = subtotal - discountAmount;

                    totalElement.textContent = `R$ ${total.toFixed(2)}`;
                    localStorage.setItem('total', total.toFixed(2));
                    alert(`Cupom aplicado! Você economizou R$ ${discountAmount.toFixed(2)}`);
                } else {
                    alert('Cupom inválido!');
                }
            });
        }
    } catch (error) {
        console.error('Erro na inicialização:', error);
        alert('Ocorreu um erro ao inicializar a página. Por favor, recarregue.');
    }
});

// Função para exibir mensagem ao adicionar produto
function showMessage(productName) {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerText = `Produto adicionado ${productName} ao seu carrinho com sucesso!`;
    
    // Exibir contêiner de mensagem
    messageContainer.style.display = 'block';
    
    // Ocultar contêiner após 3 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}

// Seletor dos botões
const addToCartButtons = document.querySelectorAll('.add-to-cart-button'); 
addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const productName = event.target.dataset.productName; // Supondo que você tenha um atributo data-product-name no botão
        showMessage(productName); // Chama a função com o nome do produto
    }); // Fechando o addEventListener
}); // Fechando o forEach

// Selecionando os elementos do DOM 
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente carregado e analisado.");

    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total');
    const couponInput = document.getElementById("couponCode");
    const applyCouponButton = document.getElementById("applyCouponButton");

    console.log("subtotalElement:", subtotalElement);
    console.log("totalElement:", totalElement);
    console.log("couponInput:", couponInput);
    console.log("applyCouponButton:", applyCouponButton);

    // Verifica se os elementos existem antes de tentar acessá-los
    if (!subtotalElement || !totalElement) {
        console.error("Elemento subtotal ou total não encontrado!");
        return; // Para evitar erros futuros
    }

    // Define o subtotal a partir do elemento HTML
    let subtotal = parseFloat(subtotalElement.innerText.replace("R$ ", "").replace(",", "."));

    // Função para aplicar o desconto
    applyCouponButton.addEventListener("click", function () {
        const couponCode = couponInput.value.trim().toUpperCase();
        console.log("Cupom inserido:", couponCode); // Log do cupom inserido

        const coupons = {
            "DESCONTO10": 0.10, // 10% de desconto
            "DESCONTO20": 0.20, // 20% de desconto
            "FRETEGRATIS": 5.00 // R$ 5,00 de desconto
        };

        let discountAmount = 0;

        // Verifica se o cupom é válido
        if (coupons[couponCode]) {
            const discount = coupons[couponCode];
            if (discount < 1) {
                discountAmount = subtotal * discount; // Para porcentagem
            } else {
                discountAmount = discount; // Para valor fixo
            }

            const total = subtotal - discountAmount;
            totalElement.innerText = `R$ ${total.toFixed(2)}`;
            alert(`Cupom aplicado! Você economizou R$ ${discountAmount.toFixed(2)}`);

            localStorage.setItem('total', total.toFixed(2));
        } else {
            if (couponCode.length > 0) {
                alert("Cupom inválido!");
            }
        }
    }); // Fechamento do evento 'click'

    couponInput.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    }); // Fechamento do evento 'input'

    // Atualiza o valor do frete
    try {
        const valor = "Indisponível"; // Valor padrão caso não seja definido
        const prazo = "Desconhecido"; // Prazo padrão caso não seja definido
        document.getElementById('frete').textContent = `R$ ${valor} (${prazo} dias úteis)`;
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        document.getElementById('frete').textContent = 'Erro ao calcular o frete';
        alert('Não foi possível calcular o frete. Por favor, verifique se o CEP está correto e tente novamente.');
    }
}); // Fechamento do evento 'DOMContentLoaded'
