// Função para enviar o arquivo para o servidor Flask
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
            // Armazena a URL da NF-e, pode ser usada em outro lugar ou exibida
        } else {
            console.error('Erro ao enviar arquivo:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro de rede:', error);
    });
}

// Função para obter a URL da NF-e
function getInvoiceUrl() {
    fetch('http://localhost:5000/api/getInvoiceUrl')
        .then(response => response.json())
        .then(data => {
            if (data.pdfUrl) {
                console.log('URL da NF-e:', data.pdfUrl);
                // Aqui você pode fazer algo com a URL, como abrir o PDF ou fazer o download
            } else {
                console.error('Erro ao obter URL da NF-e:', data.error);
            }
        })
        .catch(error => {
            console.error('Erro de rede:', error);
        });
}

// Exemplo de como utilizar as funções
const inputFile = document.querySelector('#invoiceFileInput'); // Selecionando o input de arquivo
const orderId = 12345; // Exemplo de ID do pedido

// Quando o usuário selecionar um arquivo, chamamos a função de upload
inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadInvoice(file, orderId);
    }
});

// Você pode também chamar a função para obter a URL da NF-e
getInvoiceUrl();
