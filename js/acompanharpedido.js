// Função para carregar o resumo do pedido
async function loadOrderSummary(orderId) {
    try {
        const response = await fetch(`/api/order-summary?order_id=${orderId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        const productsSummary = document.getElementById('products-summary');
        productsSummary.innerHTML = ''; // Limpa os produtos anteriores

        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            data.products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.textContent = `${product.name} - R$ ${product.price}`;
                productsSummary.appendChild(productElement);
            });
        } else {
            productsSummary.textContent = 'Nenhum produto encontrado.';
        }

        document.getElementById('order-total').textContent = `Total do Pedido: R$ ${data.orderTotal || '0.00'}`;
    } catch (error) {
        console.error("Erro ao carregar o resumo do pedido:", error);
    }
}

// Função para carregar o histórico de pedidos
async function loadOrderHistory(userId) {
    try {
        const response = await fetch(`/api/order-history?user_id=${userId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Limpa o histórico anterior

        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
            data.orders.forEach(order => {
                const historyItem = document.createElement('div');
                historyItem.textContent = `Pedido #${order.id} - ${order.date}`;

                // Botão de rastreio
                const trackButton = document.createElement('button');
                trackButton.textContent = 'Rastrear';
                trackButton.style.marginLeft = '10px'; // Apenas para espaçamento básico

                // Adiciona o evento de rastreamento ao botão
                trackButton.addEventListener('click', async () => {
                    await trackOrder(order.trackingCode);
                });

                historyItem.appendChild(trackButton);
                historyList.appendChild(historyItem);
            });
        } else {
            historyList.textContent = 'Nenhum histórico de pedidos disponível.';
        }
    } catch (error) {
        console.error("Erro ao carregar o histórico de pedidos:", error);
    }
}

// Função para rastrear o pedido
async function trackOrder(trackingCode) {
    try {
        const response = await fetch(`https://api.correios.com.br/track?code=${trackingCode}`);
        if (!response.ok) throw new Error(`Erro ao rastrear: ${response.status}`);
        const trackingData = await response.json();

        // Exibir informações de rastreamento (exemplo básico)
        alert(`Status do pedido: ${trackingData.status}\nÚltima atualização: ${trackingData.lastUpdate}`);
    } catch (error) {
        console.error("Erro ao rastrear o pedido:", error);
        alert('Não foi possível rastrear o pedido. Tente novamente mais tarde.');
    }
}

// Função para atualizar o status do pedido
async function updateOrderStatus(orderId) {
    try {
        const response = await fetch(`/api/order-status?order_id=${orderId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        const statusElements = document.querySelectorAll('.step');
        const statusEtapas = ["pedido_recebido", "preparacao", "enviado", "em_transito", "entregue"];

        statusElements.forEach((step, index) => {
            if (index <= statusEtapas.indexOf(data.status)) {
                step.classList.add("active");
                step.textContent = statusEtapas[index].replace("_", " ").toUpperCase();
            } else {
                step.classList.remove("active");
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
    }
}

// Função para atualizar o status do pedido com dados reais
async function updateOrderProgression(orderId) {
    try {
        // Consulta o status atual do pedido a partir da API real
        const response = await fetch(`/api/order-status?order_id=${orderId}`);
        if (!response.ok) throw new Error(`Erro ao obter status do pedido: ${response.status}`);
        
        // Recupera o status do pedido da resposta da API
        const data = await response.json();

        if (data.status) {
            updateOrderStatus(orderId); // Atualiza o status com a função existente

            // Verifica se o status chegou a "entregue" e não precisa mais atualizar
            if (data.status === "entregue") {
                console.log('Pedido entregue com sucesso.');
                return; // A execução da função termina aqui
            } else {
                console.log(`Status atual do pedido: ${data.status}`);
            }
        } else {
            console.log('Status do pedido não encontrado.');
        }
    } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
    }
}

// Função para simular a atualização contínua a cada 5 segundos (pode ser substituída com uma lógica mais robusta)
function startOrderProgressionTracking(orderId) {
    // A função `setInterval` simula o monitoramento em tempo real
    const interval = setInterval(async () => {
        try {
            // Consulta o status atual do pedido
            await updateOrderProgression(orderId); // Atualiza o status do pedido

            // Se o pedido for entregue, interrompe o intervalo
            const response = await fetch(`/api/order-status?order_id=${orderId}`);
            const data = await response.json();

            if (data.status === "entregue") {
                clearInterval(interval); // Para o monitoramento contínuo
                console.log('Pedido entregue. Monitoramento interrompido.');
            }
        } catch (error) {
            console.error("Erro ao rastrear o status do pedido:", error);
            clearInterval(interval); // Para o intervalo em caso de erro
        }
    }, 5000); // Verifica o status a cada 5 segundos
}

// Inicia o monitoramento assim que o pedido for realizado, passando o ID do pedido
const orderId = 123; // Substitua com o ID real do pedido
startOrderProgressionTracking(orderId);


async function updateOrderStatus(orderId) {
    try {
        const response = await fetch(`/api/order-status?order_id=${orderId}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        const statusElements = document.querySelectorAll('.step');
        const statusEtapas = ["pedido_recebido", "preparacao", "enviado", "em_transito", "entregue"];

        statusElements.forEach((step, index) => {
            if (index <= statusEtapas.indexOf(data.status)) {
                step.classList.add("active");
                step.textContent = statusEtapas[index].replace("_", " ").toUpperCase();
            } else {
                step.classList.remove("active");
            }
        });

        // Verifica se o status é "Enviado" para exibir o rastreio
        if (data.status === "enviado" && data.trackingCode) {
            const trackingInfo = document.getElementById('tracking-info');
            const trackingCodeElement = document.getElementById('tracking-code');
            const trackingLink = document.getElementById('tracking-link');

            trackingCodeElement.textContent = data.trackingCode;
            trackingLink.href = `https://rastreamento.correios.com.br/app/index.php?objeto=${data.trackingCode}`;
            trackingInfo.style.display = 'block'; // Exibe a seção de rastreio
        }
    } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
    }
}

// Função para configurar o link de download da NF-e
function setInvoiceDownloadLink(pdfUrl) {
    const pdfLink = document.getElementById('download-pdf');
    pdfLink.href = pdfUrl;
    pdfLink.download = "NF-e.pdf";
    pdfLink.style.display = 'block';
}

// Ao carregar a página, inicializar as funções
document.addEventListener("DOMContentLoaded", async () => {
    const orderId = 1; // Substitua pelo ID real do pedido
    const userId = 1; // Substitua pelo ID real do usuário

    // Carrega os dados necessários
    await loadOrderSummary(orderId);
    await loadOrderHistory(userId);
    await updateOrderStatus(orderId);

    // Configura evento no botão "Finalizar Pedido"
    const finalizeButton = document.getElementById("finalizar-pedido");
    if (finalizeButton) {
        finalizeButton.addEventListener("click", () => {
            simulateOrderProgression(orderId);
        });
    }

    // Configura FAQs
    const questions = document.querySelectorAll(".faq-question");
    questions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });

    // Configura link de download da NF-e
    try {
        const response = await fetch('/api/getInvoiceUrl');
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();

        if (data.pdfUrl) {
            setInvoiceDownloadLink(data.pdfUrl);
        } else {
            console.warn("NF-e não disponível.");
        }
    } catch (error) {
        console.error("Erro ao carregar a NF-e:", error);
    }
});

const finalizeButton = document.getElementById("finalizar-pedido");
if (finalizeButton) {
    finalizeButton.addEventListener("click", async () => {
        try {
            const response = await fetch('/api/finalize-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: 1, // Substitua com o ID real do pedido
                    userId: 1,  // Substitua com o ID real do usuário
                }),
            });

            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            const result = await response.json();

            if (result.success) {
                alert('Pedido finalizado com sucesso!');
            } else {
                alert('Erro ao finalizar o pedido. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro ao finalizar o pedido:", error);
            alert('Erro ao finalizar o pedido.');
        }
    });
}
