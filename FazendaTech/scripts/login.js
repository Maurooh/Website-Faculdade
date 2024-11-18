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
    e.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');

    if (loginForm && !loginForm.classList.contains('hidden')) {
        login();
    } else if (cadastroForm && !cadastroForm.classList.contains('hidden')) {
        cadastro();
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


function login() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    if (usuario && senha) {
        fetch('https://apis-ppqi.onrender.com/api/login', {
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
                
                // Aqui atualiza o botão de login para mostrar o nome do usuário
                const loginButton = document.getElementById('abrirLogin');
                loginButton.textContent = data.nome; // Muda o texto do botão
                loginButton.classList.add('usuario-logado'); // Adiciona uma classe opcional
                loginButton.removeAttribute('id'); // Remove o ID se não precisar

                // Opcional: Esconder o botão de login
                loginButton.style.display = 'none';
                
                // Criar um elemento para mostrar o nome do usuário
                const nomeUsuario = document.createElement('span');
                nomeUsuario.textContent = data.nome; // Nome do usuário
                nomeUsuario.classList.add('nome-usuario'); // Adiciona uma classe para estilo
                loginButton.parentNode.insertBefore(nomeUsuario, loginButton.nextSibling); // Insere após o botão

                localStorage.setItem('nomeUsuario', data.nome);

                // Fechar o popup de login
                fecharPopup();
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.');
        });
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}


function cadastro() {
    const nome_cliente = document.getElementById('nomeCliente').value;
    const cpf = document.getElementById('cpf').value;
    const usuario = document.getElementById('usuarioCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;
    const endereco = document.getElementById('enderecoCadastro').value;

    if (nome_cliente && cpf && usuario && senha && endereco) {
        fetch('https://apis-ppqi.onrender.com/api/cadastro', {
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

const nomeUsuario = localStorage.getItem('nomeUsuario');

if (nomeUsuario) {
    const loginButton = document.getElementById('abrirLogin');
    loginButton.textContent = nomeUsuario; // Atualiza o texto do botão
    loginButton.classList.add('usuario-logado'); // Adiciona uma classe opcional
    loginButton.removeAttribute('id'); // Remove o ID se não precisar

    // Opcional: Esconder o botão de login
    loginButton.style.display = 'none';
    
    // Criar um elemento para mostrar o nome do usuário
    const nomeUsuarioSpan = document.createElement('span');
    nomeUsuarioSpan.textContent = nomeUsuario; // Nome do usuário
    nomeUsuarioSpan.classList.add('nome-usuario'); // Adiciona uma classe para estilo
    loginButton.parentNode.insertBefore(nomeUsuarioSpan, loginButton.nextSibling); // Insere após o botão
}