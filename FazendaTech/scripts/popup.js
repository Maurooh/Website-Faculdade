const popup = document.getElementById('popupLogin');
const botaoAbrir = document.getElementById('abrirLogin');
const botaoFechar = document.querySelector('.fecharPopup');
const btnLogin = document.getElementById('btnLogin');
const btnCadastro = document.getElementById('btnCadastro');
const btnVoltarLogin = document.getElementById('btnVoltarLogin');
const formContainer = document.getElementById('formContainer');
const loginForm = document.getElementById('loginForm');
const cadastroForm = document.getElementById('cadastroForm');

// Função para abrir o popup sem expandir
function abrirPopup() {
    popup.style.display = 'flex';
    popup.classList.remove('expandido'); // Garante que não está expandido
    formContainer.classList.remove('show'); // Garante que o formulário não está visível
}

// Função para fechar o popup
function fecharPopup() {
    popup.style.display = 'none';
    popup.classList.remove('expandido'); // Garante que o popup não fique expandido
}

// Abrir o popup quando o botão de login for clicado
botaoAbrir.addEventListener('click', abrirPopup);

// Fechar o popup quando o botão de fechar (X) for clicado
botaoFechar.addEventListener('click', fecharPopup);

// Fechar o popup se o usuário clicar fora da área do popup
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        fecharPopup();
    }
});

// Mostrar os campos de login ou cadastro e expandir o popup
btnLogin.addEventListener('click', function () {
    loginForm.style.display = 'block';
    cadastroForm.style.display = 'none';
    formContainer.classList.add('show'); // Exibe o conteúdo completo
    popup.classList.add('expandido'); // Expande o popup
});

btnCadastro.addEventListener('click', function () {
    loginForm.style.display = 'none';
    cadastroForm.style.display = 'block';
    formContainer.classList.add('show'); // Exibe o conteúdo completo
    popup.classList.add('expandido'); // Expande o popup
});

// Função de "Voltar" para esconder os formulários e reduzir o tamanho do popup
btnVoltarLogin.addEventListener('click', function () {
    loginForm.style.display = 'none';
    cadastroForm.style.display = 'none';
    formContainer.classList.remove('show'); // Esconde o conteúdo do formulário
    popup.classList.remove('expandido'); // Reduz o tamanho do popup
});