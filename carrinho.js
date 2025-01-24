// Função para carregar e exibir os produtos no carrinho
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
    atualizarTotal();
}

// Função para atualizar o subtotal e total do carrinho
function atualizarTotal() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotal = 0;

    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade; // Soma o total de cada item (preço * quantidade)
    });

    // Atualiza o subtotal e o total na página
    const subtotalElement = document.querySelector('.info div:nth-child(1) span:last-child');
    const totalElement = document.querySelector('footer span:last-child');
    
    if (subtotalElement) {
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    } else {
        console.error("Elemento subtotal não encontrado!");
    }

    if (totalElement) {
        totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    } else {
        console.error("Elemento total não encontrado!");
    }
}

// Função para manipular a quantidade e remoção dos produtos
function manipularCarrinho() {
    document.querySelector('tbody').addEventListener('click', function(e) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const index = e.target.closest('button')?.dataset.index;

        if (e.target.closest('.btn-quantidade')) {
            const action = e.target.closest('button').dataset.action;

            if (action === 'aumentar') {
                carrinho[index].quantidade += 1;
            } else if (action === 'diminuir' && carrinho[index].quantidade > 1) {
                carrinho[index].quantidade -= 1;
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            carregarCarrinho(); // Atualiza o carrinho e os valores
        }

        if (e.target.closest('.remove')) {
            carrinho.splice(index, 1); // Remove o item do carrinho
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            carregarCarrinho(); // Atualiza o carrinho e os valores
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

// Carrega o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    manipularCarrinho();
    
    // Adiciona o evento para o botão de finalizar compra
    document.querySelector('.finalizar-compra').addEventListener('click', finalizarCompra);
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
    });
});

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

        // Inicializa o valor do desconto
        let discountAmount = 0;

        // Verifica se o cupom é válido
        if (coupons[couponCode]) {
            const discount = coupons[couponCode];
            // Calcula o valor do desconto com base no tipo
            if (discount < 1) {
                discountAmount = subtotal * discount; // Para porcentagem
            } else {
                discountAmount = discount; // Para valor fixo
            }

            // Atualiza o total
            const total = subtotal - discountAmount;
            console.log("Subtotal:", subtotal);
            console.log("Desconto:", discountAmount);
            console.log("Total após desconto:", total);

            // Atualiza os elementos no HTML
            totalElement.innerText = `R$ ${total.toFixed(2)}`;
            alert(`Cupom aplicado! Você economizou R$ ${discountAmount.toFixed(2)}`);

            // Armazenar total no localStorage
            localStorage.setItem('total', total.toFixed(2));
        } else {
            // Se o cupom não for válido, mostra uma mensagem de erro somente se o valor for inserido
            if (couponCode.length > 0) { // Verifica se o campo não está vazio
                alert("Cupom inválido!"); // Mensagem se o cupom não for válido
            }
        }
    });

    // Função para converter o texto do input em maiúsculas ao digitar
    couponInput.addEventListener("input", function () {
        this.value = this.value.toUpperCase(); // Transforma o texto em maiúsculas
    });
});

// Função para calcular o frete
async function calcularFrete() {
    const cepDestino = document.getElementById("cep").value;
    const cepOrigem = "16201-169"; // CEP da sua empresa
    const peso = 2; // Peso do pacote em kg
    const comprimento = 20; // Comprimento em cm
    const altura = 10; // Altura em cm
    const largura = 15; // Largura em cm
    const servico = "04014"; // Código Sedex

    const params = new URLSearchParams({
        nCdEmpresa: "", // Deixe vazio se não tiver contrato
        sDsSenha: "", // Deixe vazio se não tiver contrato
        nCdServico: servico,
        sCepOrigem: cepOrigem,
        sCepDestino: cepDestino,
        nVlPeso: peso,
        nCdFormato: 1, // 1 = Caixa
        nVlComprimento: comprimento,
        nVlAltura: altura,
        nVlLargura: largura,
        nVlDiametro: 0,
        sCdMaoPropria: "N",
        nVlValorDeclarado: 0,
        sCdAvisoRecebimento: "N",
        StrRetorno: "xml",
    });

    try {
        const response = await fetch(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${params}`);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        const valor = xmlDoc.getElementsByTagName("Valor")[0].childNodes[0].nodeValue;
        const prazo = xmlDoc.getElementsByTagName("PrazoEntrega")[0].childNodes[0].nodeValue;

        document.getElementById("resultadoFrete").innerText = `Frete: R$ ${valor} | Prazo: ${prazo} dias úteis`;
    } catch (error) {
        document.getElementById("resultadoFrete").innerText = "Erro ao calcular o frete.";
        console.error("Erro ao calcular frete:", error);
    }
}