document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o redirecionamento padrão do formulário

        const formData = new FormData(this);
        const data = {};

        // Converte FormData para um objeto
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Envia o formulário usando Fetch API
        fetch('https://api.staticforms.xyz/submit', {
            method: 'POST',
            body: JSON.stringify(data), // Enviando os dados como JSON
            headers: {
                'Content-Type': 'application/json' // Indicando que estamos enviando JSON
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Obtém a mensagem de confirmação
                const confirmationMessage = document.getElementById('confirmationMessage');
                
                // Exibe a mensagem de confirmação se o e-mail foi enviado com sucesso
                confirmationMessage.style.display = 'block';
                confirmationMessage.textContent = "E-mail enviado com sucesso!"; // Mensagem personalizada
                
                // Limpa o formulário
                document.getElementById('contactForm').reset(); 
                
                // Oculta a mensagem após 5 segundos (5000 milissegundos)
                setTimeout(() => {
                    confirmationMessage.style.display = 'none';
                }, 5000);
            } else {
                alert('Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.');
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde.');
        });
    });
});