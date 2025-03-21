// Função para carregar e exibir os produtos no carrinho
async function carregarCarrinho() {
    try {
        const response = await fetch('/api/carrinho', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar carrinho');
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
        const response = await fetch('/api/carrinho', {
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
            localStorage.setItem('subtotal', subtotal.toFixed(2));
        } else {
            console.warn("Elementos de total não encontrados na página");
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

            const response = await fetch(`/api/carrinho/${index}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                ...(action && {body: JSON.stringify({ action })})
            });

            if (!response.ok) {
                throw new Error(`Erro ao ${isRemove ? 'remover' : 'atualizar'} item`);
            }

            await response.json();
            await carregarCarrinho();

        } catch (error) {
            console.error('Erro ao manipular carrinho:', error);
            alert('Ocorreu um erro ao atualizar o carrinho. Por favor, tente novamente.');
        }
    });
}

// Função para redirecionar para a página de checkout
function finalizarCompra() {
    try {
        const subtotal = localStorage.getItem('subtotal');
        if (!subtotal || parseFloat(subtotal) === 0) {
            alert('O carrinho está vazio. Adicione produtos antes de finalizar a compra.');
            return;
        }
        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        alert('Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.');
    }
}

// Carrega o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    try {
        carregarCarrinho();
        manipularCarrinho();
        
        const finalizarCompraBtn = document.querySelector('.finalizar-compra');
        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', finalizarCompra);
        }
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
    }
});

// Função para exibir mensagem ao adicionar produto
function showMessage(productName) {
    try {
        const messageContainer = document.querySelector('.message-container');
        if (!messageContainer) return;

        messageContainer.innerText = `Produto ${productName} adicionado ao seu carrinho com sucesso!`;
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Erro ao exibir mensagem:', error);
    }
}

// Seletor dos botões
const addToCartButtons = document.querySelectorAll('.add-to-cart-button'); 

addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        try {
            const productName = event.target.dataset.productName;
            if (productName) {
                showMessage(productName);
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    });
});

// Função para calcular o frete
async function calcularFrete() {
    try {
        const cepDestino = document.getElementById("cep")?.value;
        if (!cepDestino) {
            throw new Error('CEP não informado');
        }

        const params = new URLSearchParams({
            nCdEmpresa: "",
            sDsSenha: "",
            nCdServico: "04014",
            sCepOrigem: "16201-169",
            sCepDestino: cepDestino,
            nVlPeso: "2",
            nCdFormato: "1",
            nVlComprimento: "20",
            nVlAltura: "10",
            nVlLargura: "15",
            nVlDiametro: "0",
            sCdMaoPropria: "N",
            nVlValorDeclarado: "0",
            sCdAvisoRecebimento: "N",
            StrRetorno: "xml"
        });

        const response = await fetch(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${params}`);
        if (!response.ok) {
            throw new Error('Erro na consulta aos Correios');
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        
        const valor = xmlDoc.getElementsByTagName("Valor")[0]?.childNodes[0]?.nodeValue;
        const prazo = xmlDoc.getElementsByTagName("PrazoEntrega")[0]?.childNodes[0]?.nodeValue;

        if (!valor || !prazo) {
            throw new Error('Dados de frete não encontrados');
        }

        const resultadoElement = document.getElementById("resultadoFrete");
        if (resultadoElement) {
            resultadoElement.innerText = `Frete: R$ ${valor} | Prazo: ${prazo} dias úteis`;
        }

    } catch (error) {
        console.error("Erro ao calcular frete:", error);
        const resultadoElement = document.getElementById("resultadoFrete");
        if (resultadoElement) {
            resultadoElement.innerText = "Erro ao calcular o frete. Verifique o CEP informado.";
        }
    }
}

// Selecionando os elementos do DOM
document.addEventListener("DOMContentLoaded", function () {
    try {
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total');
        const couponInput = document.getElementById("couponCode");
        const applyCouponButton = document.getElementById("applyCouponButton");

        if (!subtotalElement || !totalElement || !couponInput || !applyCouponButton) {
            throw new Error('Elementos necessários não encontrados');
        }

        let subtotal = parseFloat(subtotalElement.innerText.replace("R$ ", "").replace(",", ".")) || 0;

        applyCouponButton.addEventListener("click", function () {
            try {
                const couponCode = couponInput.value.trim().toUpperCase();
                
                const coupons = {
                    "DESCONTO10": 0.10,
                    "DESCONTO20": 0.20,
                    "FRETEGRATIS": 5.00
                };

                if (!couponCode) return;

                const discount = coupons[couponCode];
                if (!discount) {
                    alert("Cupom inválido!");
                    return;
                }

                const discountAmount = discount < 1 ? subtotal * discount : discount;
                const total = subtotal - discountAmount;

                totalElement.innerText = `R$ ${total.toFixed(2)}`;
                localStorage.setItem('total', total.toFixed(2));
                alert(`Cupom aplicado! Você economizou R$ ${discountAmount.toFixed(2)}`);

            } catch (error) {
                console.error('Erro ao aplicar cupom:', error);
                alert('Erro ao aplicar o cupom. Por favor, tente novamente.');
            }
        });

        couponInput.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });

    } catch (error) {
        console.error('Erro ao inicializar elementos do DOM:', error);
    }
});