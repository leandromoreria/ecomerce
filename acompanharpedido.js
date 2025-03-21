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
                productElement.textContent = `${product.name} - R$ ${product.price.toFixed(2)}`;
                productsSummary.appendChild(productElement);
            });
        } else {
            productsSummary.textContent = 'Nenhum produto encontrado.';
        }

        const total = data.orderTotal || 0;
        document.getElementById('order-total').textContent = total.toFixed(2);
    } catch (error) {
        console.error("Erro ao carregar o resumo do pedido:", error);
        document.getElementById('products-summary').textContent = 'Erro ao carregar produtos.';
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

        if (data.orders?.length > 0) {
            data.orders.forEach(order => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = `Pedido #${order.id} - ${new Date(order.date).toLocaleDateString()}`;

                if (order.trackingCode) {
                    const trackButton = document.createElement('button');
                    trackButton.textContent = 'Rastrear';
                    trackButton.className = 'track-button';
                    trackButton.addEventListener('click', () => trackOrder(order.trackingCode));
                    historyItem.appendChild(trackButton);
                }

                historyList.appendChild(historyItem);
            });
        } else {
            historyList.textContent = 'Nenhum histórico de pedidos disponível.';
        }
    } catch (error) {
        console.error("Erro ao carregar o histórico de pedidos:", error);
        document.getElementById('history-list').textContent = 'Erro ao carregar histórico.';
    }
}

// Função para rastrear o pedido
async function trackOrder(trackingCode) {
    if (!trackingCode) {
        alert('Código de rastreio não disponível.');
        return;
    }

    try {
        const response = await fetch(`https://api.correios.com.br/track?code=${trackingCode}`);
        if (!response.ok) throw new Error(`Erro ao rastrear: ${response.status}`);
        const trackingData = await response.json();

        const trackingInfo = document.getElementById('tracking-info');
        const trackingCodeElement = document.getElementById('tracking-code');
        const trackingLink = document.getElementById('tracking-link');

        trackingCodeElement.textContent = trackingCode;
        trackingLink.href = `https://rastreamento.correios.com.br/app/index.php?objeto=${trackingCode}`;
        trackingInfo.style.display = 'block';

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
        const currentStatusIndex = statusEtapas.indexOf(data.status);

        if (currentStatusIndex === -1) {
            throw new Error('Status inválido recebido do servidor');
        }

        statusElements.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStatusIndex);
            step.textContent = statusEtapas[index].replace(/_/g, ' ').toUpperCase();
        });

        if (data.status === "enviado" && data.trackingCode) {
            const trackingInfo = document.getElementById('tracking-info');
            const trackingCodeElement = document.getElementById('tracking-code');
            const trackingLink = document.getElementById('tracking-link');

            trackingCodeElement.textContent = data.trackingCode;
            trackingLink.href = `https://rastreamento.correios.com.br/app/index.php?objeto=${data.trackingCode}`;
            trackingInfo.style.display = 'block';
        }
    } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
        alert('Erro ao atualizar status do pedido.');
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
            await updateOrderStatus(orderId);
            return data.status === "entregue";
        }
        return false;
    } catch (error) {
        console.error("Erro ao atualizar o status do pedido:", error);
        return false;
    }
}

let progressionInterval;

function startOrderProgressionTracking(orderId) {
    if (progressionInterval) {
        clearInterval(progressionInterval);
    }

    progressionInterval = setInterval(async () => {
        try {
            const isDelivered = await updateOrderProgression(orderId);
            if (isDelivered) {
                clearInterval(progressionInterval);
                console.log('Pedido entregue. Monitoramento finalizado.');
            }
        } catch (error) {
            console.error("Erro ao rastrear o status do pedido:", error);
            clearInterval(progressionInterval);
        }
    }, 5000);
}

// Inicialização da página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const orderId = new URLSearchParams(window.location.search).get('orderId') || 1;
        const userId = localStorage.getItem('userId') || 1;

        await Promise.all([
            loadOrderSummary(orderId),
            loadOrderHistory(userId),
            updateOrderStatus(orderId)
        ]);

        startOrderProgressionTracking(orderId);

        // Configuração dos FAQs
        document.querySelectorAll(".faq-question").forEach(question => {
            question.addEventListener("click", () => {
                const answer = question.nextElementSibling;
                answer.style.display = answer.style.display === "block" ? "none" : "block";
            });
        });

        // Configuração do download da NF-e
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/api/invoice/${orderId}`);
                    if (!response.ok) throw new Error('Erro ao baixar NF-e');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `NFe-${orderId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Erro ao baixar NF-e:', error);
                    alert('Erro ao baixar NF-e. Tente novamente mais tarde.');
                }
            });
        }
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        alert('Erro ao carregar a página. Por favor, recarregue.');
    }
});
