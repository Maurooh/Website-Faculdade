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

// Função para atualizar o cabeçalho (exibe o botão de login ou logout dependendo do estado)
function updateHeader() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const loginButton = document.getElementById('abrirLogin');
    let usuarioInfo = document.getElementById('usuarioInfo');

    if (nomeUsuario) {
        if (!usuarioInfo) {
            // Cria um elemento para exibir o nome se não existir
            usuarioInfo = document.createElement('span');
            usuarioInfo.id = 'usuarioInfo';
            usuarioInfo.classList.add('nome-usuario');
            loginButton.parentNode.insertBefore(usuarioInfo, loginButton.nextSibling);
        }
        usuarioInfo.textContent = `Bem-vindo, ${nomeUsuario}`;
        usuarioInfo.style.display = 'inline';
        loginButton.style.display = 'none'; // Esconde o botão de login
    } else {
        if (usuarioInfo) {
            usuarioInfo.style.display = 'none'; // Esconde a informação do usuário
        }
        loginButton.style.display = 'inline'; // Mostra o botão de login
    }
}

window.onload = updateHeader;


// Chama a função para atualizar o cabeçalho ao carregar a página


document.getElementById('logoutButton').addEventListener('click', function (e) {
    e.preventDefault(); // Impede a navegação ao clicar no link

    // Limpa todo o localStorage
    localStorage.clear();

    // Atualiza a interface para mostrar o botão de login novamente
    updateHeader();
});
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

                // Salva o nome do usuário no localStorage
                localStorage.setItem('nomeUsuario', data.nome);

                // Atualiza o cabeçalho imediatamente
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

window.onload = updateHeader;
// Cadastro
function cadastro() {
    const nome_cliente = document.getElementById('nomeCliente').value;
    const cpf = document.getElementById('cpf').value;
    const usuario = document.getElementById('usuarioCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;
    const endereco = document.getElementById('enderecoCadastro').value;

    if (nome_cliente && cpf && usuario && senha && endereco) {
        fetch('https://pimhtml.onrender.com/api/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome_cliente: nome_cliente,
                cpf: cpf,
                email: usuario,
                senha: senha,
                endereco: endereco
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                fecharPopup(); // Fechar o popup após cadastro
                voltar(); // Voltar para a tela de seleção
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar o usuário:', error);
            alert('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
        });
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

