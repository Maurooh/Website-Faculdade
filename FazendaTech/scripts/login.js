function abrirPopup() {
    document.querySelector('.popup').classList.add('active');
}

// Função para fechar o popup e remover o efeito de desfoque
function fecharPopup() {
    document.querySelector('.popup').classList.remove('active');
    resetarFormularios(); // Resetar os formulários ao fechar o popup
}

// Adiciona eventos de clique para abrir e fechar o popup
document.getElementById('abrirLogin').addEventListener('click', abrirPopup);
document.querySelector('.fecharPopup').addEventListener('click', fecharPopup);

document.getElementById('btnLogin').addEventListener('click', function () {
    mostrarFormulario('login');
});

document.getElementById('btnCadastro').addEventListener('click', function () {
    mostrarFormulario('cadastro');
});

// Função para mostrar o formulário apropriado
function mostrarFormulario(tipo) {
    document.getElementById('formSelector').style.display = 'none';
    document.getElementById('formContainer').classList.remove('hidden');

    if (tipo === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('cadastroForm').classList.add('hidden');
    } else if (tipo === 'cadastro') {
        document.getElementById('cadastroForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }
}

document.querySelector('#formLoginCadastro').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o recarregamento da página

    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');

    if (loginForm && !loginForm.classList.contains('hidden')) {
        login();  // Função que realiza o login
    } else if (cadastroForm && !cadastroForm.classList.contains('hidden')) {
        cadastro();  // Função que realiza o cadastro
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});

function voltar() {
    resetarFormularios(); // Resetar os formulários ao voltar
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('formSelector').style.display = 'block';
}

document.getElementById('btnVoltarLogin').addEventListener('click', voltar);
document.getElementById('btnVoltarCadastro').addEventListener('click', voltar);

// Função para resetar os formulários
function resetarFormularios() {
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('formSelector').style.display = 'block';
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('cadastroForm').classList.add('hidden');
}

// Função para manter o nome do usuário após trocar de página
function atualizarNomeUsuario() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const loginButton = document.getElementById('abrirLogin');
    const usuarioInfo = document.getElementById('usuarioInfo'); // Elemento para exibir o nome do usuário

    if (nomeUsuario) {
        loginButton.textContent = nomeUsuario; // Atualiza o texto do botão
        loginButton.classList.add('usuario-logado'); // Adiciona uma classe opcional
        loginButton.removeAttribute('id'); // Remove o ID se não for necessário

        // Esconder o botão de login
        loginButton.style.display = 'none';

        // Criar um elemento para mostrar o nome do usuário, se não existir
        if (!usuarioInfo) {
            const nomeUsuarioSpan = document.createElement('span');
            nomeUsuarioSpan.id = 'usuarioInfo'; // Adiciona um ID para o nome do usuário
            nomeUsuarioSpan.textContent = `Bem-vindo, ${nomeUsuario}`; // Nome do usuário
            nomeUsuarioSpan.classList.add('nome-usuario'); // Adiciona uma classe para estilo
            loginButton.parentNode.insertBefore(nomeUsuarioSpan, loginButton.nextSibling); // Insere após o botão
        }
    }
}



// Chama a função de atualização ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarNomeUsuario);
document.getElementById('logoutButton').addEventListener('click', function () {
    // Remover o nome do usuário do localStorage
    localStorage.removeItem('nomeUsuario');

    // Atualizar a interface para mostrar o botão de login novamente
    updateHeader();
});

// Função para atualizar o cabeçalho (exibe o botão de login ou logout dependendo do estado)
function updateHeader() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const loginButton = document.getElementById('abrirLogin');
    const logoutButton = document.getElementById('logoutButton');
    const usuarioInfo = document.getElementById('usuarioInfo');

    if (nomeUsuario) {
        loginButton.textContent = nomeUsuario; // Exibe o nome do usuário
        loginButton.style.display = 'none'; // Esconde o botão de login
        logoutButton.style.display = 'inline'; // Exibe o botão de logout
        usuarioInfo.textContent = `Bem-vindo, ${nomeUsuario}`;
        usuarioInfo.style.display = 'inline';
    } else {
        loginButton.style.display = 'inline'; // Exibe o botão de login
        logoutButton.style.display = 'none'; // Esconde o botão de logout
        usuarioInfo.style.display = 'none'; // Esconde o nome do usuário
    }
}

// Chama a função para atualizar o cabeçalho ao carregar a página
window.onload = updateHeader;

// Login
function login() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    if (usuario && senha) {
        fetch('https://pimhtml.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: usuario,
                senha: senha
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                
                // Atualiza o botão de login para mostrar o nome do usuário
                const loginButton = document.getElementById('abrirLogin');
                loginButton.textContent = data.nome; // Muda o texto do botão
                loginButton.classList.add('usuario-logado'); // Adiciona uma classe opcional
                loginButton.removeAttribute('id'); // Remove o ID se não precisar

                // Esconde o botão de login
                loginButton.style.display = 'none';
                
                // Salva o nome do usuário no localStorage
                localStorage.setItem('nomeUsuario', data.nome);

                // Atualiza o cabeçalho
                updateHeader();
            } else {
                alert('Credenciais inválidas');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

// Cadastro
function cadastro() {
    const nome = document.getElementById('nomeCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;
    
    if (nome && email && senha) {
        fetch('https://pimhtml.onrender.com/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}