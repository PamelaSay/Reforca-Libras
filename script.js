// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCA5nHe1MRdnYR70flitnIjI75IOkh0ji8",
    authDomain: "reforca-app-25554.firebaseapp.com",
    projectId: "reforca-app-25554",
    storageBucket: "reforca-app-25554.firebasestorage.app",
    messagingSenderId: "469342727365",
    appId: "1:469342727365:web:cd2def6eafd29e615114ac",
    measurementId: "G-0YVN46JS8W"
};

// Inicializa o Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    console.log("Firebase e Firestore inicializados com sucesso!");
} else {
    console.error("SDK do Firebase não encontrado no HTML!");
}

// ==========================================
// ELEMENTOS E MODAIS
// ==========================================
const btnLogin = document.getElementById("btnLogin");
const modalLogin = document.getElementById("modalLogin");
const fecharLogin = document.getElementById("fecharLogin");

const abrirCadastro = document.getElementById("abrirCadastro");
const modalCadastro = document.getElementById("modalCadastro");
const fecharCadastro = document.getElementById("fecharCadastro");

const modalPerfil = document.getElementById("modalPerfil");
const fecharPerfil = document.getElementById("fecharPerfil");

// Evento no botão do Header
if (btnLogin) {
    btnLogin.onclick = () => {
        let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado) {
            if (modalPerfil) modalPerfil.style.display = "flex";
        } else {
            if (modalLogin) modalLogin.style.display = "flex";
        }
    };
}

// Fechar modais
if (fecharLogin) fecharLogin.onclick = () => modalLogin.style.display = "none";
if (fecharCadastro) fecharCadastro.onclick = () => modalCadastro.style.display = "none";
if (fecharPerfil) fecharPerfil.onclick = () => modalPerfil.style.display = "none";

// Trocar do Login para o Cadastro
if (abrirCadastro) {
    abrirCadastro.onclick = () => {
        if (modalLogin) modalLogin.style.display = "none";
        if (modalCadastro) modalCadastro.style.display = "flex";
    };
}

// ==========================================
// FUNÇÃO DE CADASTRO (Firestore + LocalStorage)
// ==========================================
function cadastrar() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    if (!nomeInput || !emailInput || !senhaInput) {
        alert("Erro: Campos de cadastro não encontrados no HTML!");
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        nivel: "Iniciante",
        pontos: 0
    };

    // Grava no banco de dados Firestore
    if (typeof db !== 'undefined') {
        db.collection("usuarios").add({
            ...novoUsuario,
            dataCriacao: new Date()
        })
        .then(() => {
            // Salva sessão local
            localStorage.setItem("usuarioCadastrado", JSON.stringify(novoUsuario));
            localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Cadastro realizado! Entrando...',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "index.html";
                });
            } else {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            console.error("Erro ao salvar no Firebase: ", error);
            alert("Erro ao cadastrar no banco de dados: " + error.message);
        });
    } else {
        alert("Erro de conexão com o banco de dados Firebase.");
    }
}

// ==========================================
// FUNÇÃO DE LOGIN
// ==========================================
function login() {
    const campoLogin = document.getElementById("loginUsuario");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoLogin || !campoSenha) return;

    let loginDigitado = campoLogin.value.trim();
    let senhaDigitada = campoSenha.value;

    let usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

    if (!usuario) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Conta não encontrada',
                text: 'Você ainda não possui cadastro.',
                confirmColor: '#3085d6'
            });
        } else {
            alert("Conta não encontrada. Faça seu cadastro!");
        }
        return;
    }

    const loginCorreto = (loginDigitado === usuario.email || loginDigitado === usuario.nome);
    const senhaCorreta = (senhaDigitada === usuario.senha);

    if (loginCorreto && senhaCorreta) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Bem-vindo(a)!',
                text: `Olá, ${usuario.nome}!`,
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            alert(`Bem-vindo(a), ${usuario.nome}!`);
        }

        if (modalLogin) modalLogin.style.display = "none";
        mostrarUsuario();
    } else {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'E-mail/Usuário ou senha incorretos!',
                confirmColor: '#d33'
            });
        } else {
            alert("E-mail/Usuário ou senha incorretos!");
        }
    }
}

// ==========================================
// ALTERNAR VISIBILIDADE DA SENHA (OLHO)
// ==========================================
function alternarSenha(idCampo, elementoIcone) {
    const campoSenha = document.getElementById(idCampo);
    if (!campoSenha) return;

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        elementoIcone.innerText = "🙈";
    } else {
        campoSenha.type = "password";
        elementoIcone.innerText = "👁️";
    }
}

// ==========================================
// FUNÇÃO ESQUECEU SUA SENHA
// ==========================================
function esqueceuSenha(event) {
    if (event) event.preventDefault();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Recuperação de Senha',
            text: 'Digite o e-mail cadastrado na sua conta:',
            input: 'email',
            inputPlaceholder: 'seu.email@exemplo.com',
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            cancelButtonText: 'Cancelar',
            confirmColor: '#3085d6',
            cancelColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                const emailDigitado = result.value.trim();
                const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

                if (usuario && usuario.email.toLowerCase() === emailDigitado.toLowerCase()) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Senha Encontrada!',
                        html: `Sua senha cadastrada é: <strong>${usuario.senha}</strong>`,
                        confirmColor: '#3085d6'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Não encontrado',
                        text: 'Nenhuma conta cadastrada foi encontrada com este e-mail.',
                        confirmColor: '#d33'
                    });
                }
            }
        });
    }
}

// ==========================================
// EXIBIR DADOS DO USUÁRIO LOGADO
// ==========================================
function mostrarUsuario() {
    let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
        if (btnLogin) btnLogin.innerHTML = "👤 " + usuario.nome;
        if (document.getElementById("nomeUsuario")) {
            document.getElementById("nomeUsuario").innerText = usuario.nome;
        }
        if (document.getElementById("pontos")) {
            document.getElementById("pontos").innerText = usuario.pontos || 0;
        }
    } else {
        if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    }
}

// ==========================================
// SAIR E EXCLUIR CONTA
// ==========================================
function sair() {
    localStorage.removeItem("usuarioLogado");
    if (modalPerfil) modalPerfil.style.display = "none";
    if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    window.location.reload();
}

function excluirConta() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Sua conta será apagada permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmColor: '#d33',
            cancelColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("usuarioCadastrado");
                localStorage.removeItem("usuarioLogado");

                if (modalPerfil) modalPerfil.style.display = "none";
                if (btnLogin) btnLogin.innerHTML = "👤 Entrar";

                Swal.fire({
                    icon: 'success',
                    title: 'Excluído!',
                    text: 'Sua conta foi removida.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            }
        });
    }
}

// ==========================================
// PESQUISAR CONTEÚDO
// ==========================================
function pesquisarConteudo() {
    let pesquisa = document.getElementById("campoPesquisa").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let nome = card.dataset.nome ? card.dataset.nome.toLowerCase() : "";
        if (nome.includes(pesquisa)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// ==========================================
// MENU RESPONSIVO & EVENTOS
// ==========================================
function menuResponsivo() {
    const nav = document.getElementById("menu-links");
    if (nav) nav.classList.toggle("ativo");
}

const btnDisciplina = document.getElementById("btnDisciplina");
if (btnDisciplina) {
    btnDisciplina.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const subnivelMatematica = document.getElementById("subnivelMatematica");
        if (subnivelMatematica) {
            subnivelMatematica.classList.toggle("ativo");
        }
    });
}

// ==========================================
// COMENTÁRIOS
// ==========================================
function salvarComentario() {
    let campo = document.getElementById("comentario");
    if (!campo) return;

    let comentario = campo.value.trim();

    if (comentario === "") {
        alert("Digite um comentário!");
        return;
    }

    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.push(comentario);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    mostrarComentarios();
    campo.value = "";
}

function mostrarComentarios() {
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    let lista = document.getElementById("lista-comentarios");

    if (!lista) return;

    lista.innerHTML = "";
    comentarios.forEach(function(item) {
        lista.innerHTML += `<div class="comentario-item">💬 ${item}</div>`;
    });
}

// ==========================================
// ABRIR JOGOS E NAVEGAÇÃO
// ==========================================
function abrirJogo(tipo) {
    if (tipo === 'potencia') window.location.href = "jogo_potencia.html";
    if (tipo === 'radiciacao') window.location.href = "jogoradiciacao.html";
    if (tipo === 'planocartesiano') window.location.href = "planocartesiano.html";
}

function voltarPagina() {
    history.back();
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();
    mostrarComentarios();
});
