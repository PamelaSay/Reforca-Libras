// CONFIGURAÇÃO DO FIREBASE
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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
var db = firebase.firestore();
var auth = firebase.auth();

// ELEMENTOS DOS MODAIS
const btnLogin = document.getElementById("btnLogin");
const modalLogin = document.getElementById("modalLogin");
const fecharLogin = document.getElementById("fecharLogin");

const abrirCadastro = document.getElementById("abrirCadastro");
const modalCadastro = document.getElementById("modalCadastro");
const fecharCadastro = document.getElementById("fecharCadastro");

const modalPerfil = document.getElementById("modalPerfil");
const fecharPerfil = document.getElementById("fecharPerfil");

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

if (fecharLogin) fecharLogin.onclick = () => modalLogin.style.display = "none";
if (fecharCadastro) fecharCadastro.onclick = () => modalCadastro.style.display = "none";
if (fecharPerfil) fecharPerfil.onclick = () => modalPerfil.style.display = "none";

if (abrirCadastro) {
    abrirCadastro.onclick = () => {
        if (modalLogin) modalLogin.style.display = "none";
        if (modalCadastro) modalCadastro.style.display = "flex";
    };
}

// FUNÇÃO DE CADASTRO
function cadastrar() {
    const nome = document.getElementById('nomeCadastro').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value;

    if (!nome || !email || !senha) {
        mostrarAlerta('warning', 'Atenção', 'Preencha todos os campos!');
        return;
    }

    // Criar conta no Authentication
    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({ displayName: nome }).then(() => user);
        })
        .then((user) => {
            const novoUsuario = {
                uid: user.uid,
                nome: nome,
                email: email,
                nivel: "Iniciante",
                pontos: 0,
                dataCriacao: new Date()
            };
            return db.collection("usuarios").doc(user.uid).set(novoUsuario).then(() => novoUsuario);
        })
        .then((dadosUsuario) => {
            localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
            mostrarAlerta('success', 'Sucesso', 'Cadastro realizado com sucesso!');
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((error) => {
            console.error("Erro no cadastro:", error);
            mostrarAlerta('error', 'Erro', 'Não foi possível realizar o cadastro.');
        });
}

// FUNÇÃO DE LOGIN ORIGINAL (Ajustada para Firebase)
function login() {
    const campoUsuario = document.getElementById("loginUsuario") || document.getElementById("emailLogin");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoUsuario || !campoSenha) return;

    const email = campoUsuario.value.trim();
    const senha = campoSenha.value;

    if (!email || !senha) {
        mostrarAlerta('warning', 'Atenção', 'Preencha todos os campos!');
        return;
    }

    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            const dadosUsuario = {
                uid: user.uid,
                email: user.email,
                nome: user.displayName || user.email.split("@")[0],
                pontos: 0
            };

            localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
            if (modalLogin) modalLogin.style.display = "none";
            mostrarUsuario();
            mostrarAlerta('success', 'Bem-vindo!', `Olá, ${dadosUsuario.nome}`);
        })
        .catch((error) => {
            console.error("Erro no login:", error);
            mostrarAlerta('error', 'Erro', 'E-mail ou senha incorretos!');
        });
}

// ALTERNAR VISIBILIDADE DA SENHA
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

// ESQUECEU A SENHA
function esqueceuSenha(event) {
    if (event) event.preventDefault();

    const email = prompt("Digite seu e-mail para redefinir a senha:");
    if (email) {
        auth.sendPasswordResetEmail(email.trim())
            .then(() => alert("E-mail de redefinição enviado com sucesso!"))
            .catch(() => alert("Erro ao enviar e-mail de redefinição."));
    }
}

// MOSTRAR USUÁRIO
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

// SAIR E EXCLUIR CONTA
function sair() {
    auth.signOut();
    localStorage.removeItem("usuarioLogado");
    if (modalPerfil) modalPerfil.style.display = "none";
    if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    window.location.reload();
}

function excluirConta() {
    if (confirm("Tem certeza que deseja excluir sua conta?")) {
        const user = auth.currentUser;
        if (user) {
            user.delete().then(() => {
                localStorage.removeItem("usuarioLogado");
                window.location.reload();
            });
        }
    }
}

// PESQUISA E NAVEGAÇÃO
function pesquisarConteudo() {
    let campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    let pesquisa = campo.value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let nome = card.dataset.nome ? card.dataset.nome.toLowerCase() : "";
        card.style.display = nome.includes(pesquisa) ? "block" : "none";
    });
}

function abrirJogo(tipo) {
    if (tipo === 'potencia') window.location.href = "jogo_potencia.html";
    if (tipo === 'radiciacao') window.location.href = "jogoradiciacao.html";
    if (tipo === 'planocartesiano') window.location.href = "planocartesiano.html";
}

function voltarPagina() {
    history.back();
}

function mostrarAlerta(icone, titulo, texto) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: icone, title: titulo, text: texto });
    } else {
        alert(`${titulo}: ${texto}`);
    }
}

// CARREGAMENTO DA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }
});
