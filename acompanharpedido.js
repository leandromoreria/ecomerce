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

// Função para simular o progresso do pedido
function simulateOrderProgression(orderId) {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(`/api/order-status?order_id=${orderId}`);
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            const data = await response.json();

            if (data.status) {
                updateOrderStatus(orderId); // Atualiza o status com a função existente

                if (data.status === "entregue") {
                    clearInterval(interval); // Para o intervalo ao atingir "entregue"
                }
            }
        } catch (error) {
            console.error("Erro ao simular o progresso do pedido:", error);
            clearInterval(interval);
        }
    }, 5000); // Verifica a cada 5 segundos
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
