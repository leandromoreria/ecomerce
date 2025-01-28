// Função para enviar o arquivo e o ID do pedido para o servidor Flask
function uploadInvoice(file, orderId) {
    const formData = new FormData();
    formData.append('file', file); // Adiciona o arquivo ao FormData
    formData.append('order_id', orderId); // Adiciona o ID do pedido ao FormData

    fetch('http://localhost:5000/uploadInvoice', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Arquivo enviado com sucesso!');
            console.log('URL da NF-e:', data.pdfUrl);
            // Exibe a URL ou usa ela em outro lugar
            alert('Nota Fiscal enviada com sucesso!');
        } else {
            console.error('Erro ao enviar arquivo:', data.message);
            alert('Erro ao enviar a Nota Fiscal.');
        }
    })
    .catch(error => {
        console.error('Erro de rede:', error);
    });
}

// Função para obter a URL da NF-e com base no pedido
function getInvoiceUrl(orderId) {
    fetch(`http://localhost:5000/api/getInvoiceUrl?order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            if (data.pdfUrl) {
                console.log('URL da NF-e:', data.pdfUrl);
                // Exemplo: abre o PDF em uma nova aba
                window.open(data.pdfUrl, '_blank');
            } else {
                console.error('Erro ao obter URL da NF-e:', data.error);
                alert('Nota Fiscal não encontrada para o pedido.');
            }
        })
        .catch(error => {
            console.error('Erro de rede:', error);
        });
}

// Integração com o formulário
const inputFile = document.querySelector('#invoiceFileInput'); // Selecionando o input de arquivo
const orderId = 12345; // Substitua pelo ID real do pedido

// Evento para enviar o arquivo ao selecionar
inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadInvoice(file, orderId);
    }
});

// Exemplo de uso: obter a URL da NF-e
getInvoiceUrl(orderId);
