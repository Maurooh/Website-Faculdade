let cartItems = [];
let total = 0;

// Função para adicionar produto ao carrinho
function addToCart(produtoID, produto, preco) {
    const existingItem = cartItems.find(item => item.produtoID === produtoID);

    if (existingItem) {
        existingItem.quantidade++;
        existingItem.totalPreco = existingItem.preco * existingItem.quantidade;
    } else {
        cartItems.push({ produtoID, produto, preco, quantidade: 1, totalPreco: preco });
    }

    total += preco;
    updateCart();
}

function exibirMensagem(texto, sucesso = true) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.innerText = texto;
    mensagemDiv.style.color = sucesso ? 'green' : 'red';
    mensagemDiv.style.display = 'block'; // Mostrar a mensagem
    

    setTimeout(() => {
        mensagemDiv.style.display = 'none';
    }, 5000);
}

// Função para atualizar o carrinho
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const carrinhoItens = document.getElementById('carrinho-itens');
    const totalElement = document.getElementById('total');

    if (cartCount) {
        cartCount.innerText = cartItems.reduce((count, item) => count + item.quantidade, 0);
    }

    carrinhoItens.innerHTML = '';

    cartItems.forEach(item => {
        carrinhoItens.innerHTML += `
            <div class="carrinho-item">
                <h3>${item.produto} (${item.quantidade}x)</h3>
                <p>R$ ${item.totalPreco.toFixed(2)}</p>
            </div>
        `;
    });

    totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Função para limpar o carrinho
function clearCart() {
    cartItems = [];
    total = 0;
    updateCart();
    exibirMensagem('O carrinho foi limpo.', true);
}

// Função para buscar os produtos e exibir na lista
axios.get('https://pimhtml.onrender.com/api/produtos')
    .then(response => {
        const produtos = response.data;
        const productList = document.getElementById('product-list'); // Supondo que a UL já está no HTML
        produtos.forEach(produto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('produto');
            productDiv.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn-carrinho" onclick="addToCart(${produto.ID_produto}, '${produto.nome}', ${produto.preco})">Adicionar ao Carrinho</button>
            `;
            productList.appendChild(productDiv); // Adiciona o produto diretamente ao container flexível
        });
    })
    .catch(error => {
        console.error('Erro ao carregar os produtos:', error);
    });

// Função para finalizar a compra
function terminarCompra() {
    if (cartItems.length === 0) {
        exibirMensagem('O carrinho está vazio!', false);
        return;
    }

    // Enviar os itens do carrinho para o backend
    axios.post('https://pimhtml.onrender.com/api/comprar', {
        cartItems: cartItems.map(item => ({
            ID_produto: item.produtoID,
            quantidade: item.quantidade
        }))
    })
    .then(response => {
        exibirMensagem('Compra realizada com sucesso!');
        clearCart();  // Limpar o carrinho após a compra

        window.location.href = 'sucesso.html';
    })
    .catch(error => {
        console.error('Erro ao finalizar a compra:', error);
        alert('Ocorreu um erro ao finalizar a compra.');
    });
}

// Adicionar eventos aos botões
document.getElementById('abrirCarrinho').addEventListener('click', function () {
    document.getElementById('carrinho').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';
});

document.querySelector('.fecharCarrinho').addEventListener('click', function () {
    document.getElementById('carrinho').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

document.querySelector('.limparCarrinho').addEventListener('click', function () {
    clearCart();
});

document.querySelector('.terminarCompra').addEventListener('click', function () {
    terminarCompra();
});