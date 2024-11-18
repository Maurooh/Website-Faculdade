const popup = document.getElementById('popupLogin');
const botaoAbrir = document.getElementById('abrirLogin');
const botaoFechar = document.querySelector('.fecharPopup');

function abrirPopup() {
    popup.style.display = 'flex';
}

function fecharPopup() {
    popup.style.display = 'none';
}

botaoAbrir.addEventListener('click', abrirPopup);
botaoFechar.addEventListener('click', fecharPopup);

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        fecharPopup();
    }
});