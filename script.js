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

let db = null;
let auth = null;

if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
}

const VERSAO_TERMOS = "1.0";
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
const modalTermos = document.getElementById("modalTermos");
const abrirTermos = document.getElementById("abrirTermos");
const fecharTermos = document.getElementById("fecharTermos");
const concordarTermos = document.getElementById("concordarTermos");

// Gestão de modais do Header
if (btnLogin) {

    btnLogin.onclick = () => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
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
if (fecharTermos) fecharTermos.onclick = () => modalTermos.style.display = "none";

if (abrirTermos) {
    abrirTermos.onclick = () => {
        if (modalTermos) modalTermos.style.display = "flex";
    };
}

if (concordarTermos) {
    concordarTermos.onclick = () => {
        const aceite = document.getElementById("aceitarTermos");
        if (aceite) aceite.checked = true;
        if (modalTermos) modalTermos.style.display = "none";
    };
}

if (abrirCadastro) {
    abrirCadastro.onclick = () => {
        if (modalLogin) modalLogin.style.display = "none";
        if (modalCadastro) modalCadastro.style.display = "flex";
    };
}

// ==========================================
// IDENTIFICAÇÃO SEM SENHA
// ==========================================
async function gerarIdDoEmail(email) {
    const bytes = new TextEncoder().encode(email.trim().toLowerCase());
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function garantirSessaoAnonima() {
    if (!auth) throw { code: "auth/indisponivel" };
    if (auth.currentUser) return auth.currentUser;
    const credencial = await auth.signInAnonymously();
    return credencial.user;
}

async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const aceiteInput = document.getElementById('aceitarTermos');

    if (!nomeInput || !emailInput || !aceiteInput) {
        exibirAlerta('error', 'Erro', 'Campos do formulário não encontrados.');
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    if (!nome || !email || !emailInput.checkValidity()) {
        exibirAlerta('warning', 'Atenção', 'Preencha o nome e informe um e-mail válido.');
        return;
    }

    if (!aceiteInput.checked) {
        exibirAlerta('warning', 'Atenção', 'Leia e aceite o Código de Ética para continuar.');
        return;
    }

    if (!auth || !db) {
        exibirAlerta('error', 'Erro', 'Serviço do Firebase não disponível.');
        return;
    }

    try {
        const usuarioAnonimo = await garantirSessaoAnonima();
        const idUsuario = await gerarIdDoEmail(email);
        const referencia = db.collection("usuarios").doc(idUsuario);
        const existente = await referencia.get();

        if (existente.exists) {
            exibirAlerta('info', 'Cadastro encontrado', 'Este e-mail já está cadastrado. Entre usando seu e-mail.');
            return;
        }

        const dadosUsuario = {
            uidAnonimoInicial: usuarioAnonimo.uid,
            nome,
            email,
            nivel: "Iniciante",
            pontos: 0,
            aulas: 0,
            jogos: 0,
            termosAceitos: true,
            versaoTermos: VERSAO_TERMOS,
            dataAceiteTermos: firebase.firestore.FieldValue.serverTimestamp(),
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
        };

        await referencia.set(dadosUsuario);

        localStorage.setItem("usuarioLogado", JSON.stringify({
            idUsuario, nome, email, pontos: 0, aulas: 0, jogos: 0
        }));

        exibirAlerta('success', 'Sucesso!', 'Cadastro realizado com sucesso!', 1500, () => {
            if (modalCadastro) modalCadastro.style.display = "none";
            mostrarUsuario();
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        exibirAlerta('error', 'Erro ao cadastrar', traduzirErroFirebase(error.code));
    }
}

// ==========================================
// FUNÇÃO DE LOGIN
// ==========================================
async function login() {
    const emailInput = document.getElementById("loginEmail");

    if (!emailInput) return;

    const email = emailInput.value.trim().toLowerCase();

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta('warning', 'Atenção', 'Informe um e-mail válido para entrar.');
        return;
    }

    if (!auth) {
        exibirAlerta('error', 'Erro', 'Serviço do Firebase não disponível.');
        return;
    }

    try {
        await garantirSessaoAnonima();
        const idUsuario = await gerarIdDoEmail(email);
        const docSnap = await db.collection("usuarios").doc(idUsuario).get();

        if (!docSnap.exists) {
            if (modalLogin) modalLogin.style.display = "none";
            if (modalCadastro) modalCadastro.style.display = "flex";
            const emailCadastro = document.getElementById("emailCadastro");
            if (emailCadastro) emailCadastro.value = email;
            exibirAlerta('info', 'Primeiro acesso', 'Informe seu nome e aceite os termos para fazer o cadastro.');
            return;
        }

        const dados = docSnap.data();
        const sessaoUsuario = {
            idUsuario,
            nome: dados.nome,
            email: dados.email,
            pontos: dados.pontos || 0,
            aulas: dados.aulas || 0,
            jogos: dados.jogos || 0
        };
        localStorage.setItem("usuarioLogado", JSON.stringify(sessaoUsuario));

        if (modalLogin) modalLogin.style.display = "none";

        exibirAlerta('success', 'Bem-vindo(a)!', `Olá, ${dados.nome}!`, 1800, () => {
            mostrarUsuario();
        });

    } catch (error) {
        console.error("Erro no login:", error);
        exibirAlerta('error', 'Falha no Login', traduzirErroFirebase(error.code));
    }
}

// ==========================================
// ALTERNAR VISIBILIDADE DA SENHA
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
// RECUPERAÇÃO DE SENHA (NATIVA DO FIREBASE)
// ==========================================
function esqueceuSenha(event) {
    if (event) event.preventDefault();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Recuperação de Senha',
            text: 'Digite o e-mail cadastrado para receber o link de redefinição:',
            input: 'email',
            inputPlaceholder: 'seu.email@exemplo.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar e-mail',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    await auth.sendPasswordResetEmail(result.value.trim());
                    Swal.fire({
                        icon: 'success',
                        title: 'E-mail enviado!',
                        text: 'Verifique sua caixa de entrada para redefinir sua senha.'
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: traduzirErroFirebase(error.code)
                    });
                }
            }
        });
    }
}

// ==========================================
// EXIBIÇÃO DE PERFIL E INTERFACE
// ==========================================
function mostrarUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
        if (btnLogin) btnLogin.innerHTML = "👤 " + usuario.nome;
        const elemNome = document.getElementById("nomeUsuario");
        const elemPontos = document.getElementById("pontos");
        const elemAulas = document.getElementById("aulas");
        const elemJogos = document.getElementById("jogos");

        if (elemNome) elemNome.innerText = usuario.nome;
        if (elemPontos) elemPontos.innerText = usuario.pontos || 0;
        if (elemAulas) elemAulas.innerText = usuario.aulas || 0;
        if (elemJogos) elemJogos.innerText = usuario.jogos || 0;
    } else {
        if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    }
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    if (modalPerfil) modalPerfil.style.display = "none";
    if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    window.location.reload();
}

async function excluirConta() {
    if (typeof Swal === 'undefined') return;

    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Sua conta será apagada permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmColor: '#d33',
        cancelColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const sessao = JSON.parse(localStorage.getItem("usuarioLogado"));
            if (sessao && sessao.idUsuario) {
                await db.collection("usuarios").doc(sessao.idUsuario).delete();
            }
            localStorage.removeItem("usuarioLogado");
            
            Swal.fire({
                icon: 'success',
                title: 'Excluído!',
                text: 'Sua conta foi removida.',
                timer: 1500,
                showConfirmButton: false
            }).then(() => window.location.reload());

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao excluir',
                text: 'Faça login novamente antes de excluir sua conta por motivos de segurança.'
            });
        }
    }
}

// ==========================================
// UTILITÁRIOS E NAVEGAÇÃO
// ==========================================
function pesquisarConteudo() {
    const campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    const pesquisa = campo.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const nome = card.dataset.nome ? card.dataset.nome.toLowerCase() : "";
        card.style.display = nome.includes(pesquisa) ? "block" : "none";
    });
}

function abrirJogo(tipo) {
    const paginas = {
        potencia: "jogo_potencia.html",
        radiciacao: "jogoradiciacao.html",
        planocartesiano: "planocartesiano.html"
    };
    if (paginas[tipo]) window.location.href = paginas[tipo];
}

function voltarPagina() {
    history.back();
}

function exibirAlerta(icon, title, text, timer = null, callback = null) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon,
            title,
            text,
            timer,
            showConfirmButton: !timer
        }).then(() => {
            if (callback) callback();
        });
    } else {
        alert(`${title}: ${text}`);
        if (callback) callback();
    }
}

function traduzirErroFirebase(codigo) {
    switch (codigo) {
        case 'auth/invalid-email':
            return 'E-mail inválido.';
        case 'auth/operation-not-allowed':
            return 'Ative o acesso Anônimo no Firebase Authentication.';
        case 'auth/network-request-failed':
            return 'Falha de conexão. Verifique sua internet.';
        case 'auth/indisponivel':
            return 'O serviço do Firebase não está disponível.';
        case 'permission-denied':
            return 'O Firebase recusou o acesso. Verifique as regras do Firestore.';
        default:
            return 'Ocorreu um erro. Tente novamente.';
    }
}

// ==========================================
// INICIALIZAÇÃO E EVENTOS DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();

    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) campoPesquisa.value = "";

    // Listener para o formulário de login (se existir)
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }

    // Listener para o formulário de cadastro (se existir)
    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();
            cadastrar();
        });
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        const campoEmail = document.getElementById("loginEmail");
        if (campoEmail) campoEmail.value = "";
    }, 150);
});

window.addEventListener("click", (evento) => {
    if (evento.target === modalLogin) modalLogin.style.display = "none";
    if (evento.target === modalCadastro) modalCadastro.style.display = "none";
    if (evento.target === modalPerfil) modalPerfil.style.display = "none";
    if (evento.target === modalTermos) modalTermos.style.display = "none";
});