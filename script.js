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

let db;
let auth;

if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();
    auth = firebase.auth();

    console.log("Firebase inicializado com sucesso.");
} else {
    console.error("O Firebase não foi carregado.");
}

// Altere quando modificar o Código de Ética
const VERSAO_TERMOS = "1.0";


// ==========================================
// ELEMENTOS DA PÁGINA
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


// ==========================================
// CONTROLE DOS MODAIS
// ==========================================

if (btnLogin) {
    btnLogin.onclick = function () {
        const usuario = obterUsuarioLocal();

        if (usuario && modalPerfil) {
            mostrarUsuario();
            modalPerfil.style.display = "flex";
        } else if (modalLogin) {
            modalLogin.style.display = "flex";
        }
    };
}

if (fecharLogin) {
    fecharLogin.onclick = function () {
        modalLogin.style.display = "none";
    };
}

if (fecharCadastro) {
    fecharCadastro.onclick = function () {
        modalCadastro.style.display = "none";
    };
}

if (fecharPerfil) {
    fecharPerfil.onclick = function () {
        modalPerfil.style.display = "none";
    };
}

if (fecharTermos) {
    fecharTermos.onclick = function () {
        modalTermos.style.display = "none";
    };
}

if (abrirCadastro) {
    abrirCadastro.onclick = function () {
        if (modalLogin) {
            modalLogin.style.display = "none";
        }

        if (modalCadastro) {
            modalCadastro.style.display = "flex";
        }
    };
}

if (abrirTermos) {
    abrirTermos.onclick = function () {
        if (modalTermos) {
            modalTermos.style.display = "flex";
        }
    };
}

if (concordarTermos) {
    concordarTermos.onclick = function () {
        const aceite = document.getElementById("aceitarTermos");

        if (aceite) {
            aceite.checked = true;
        }

        if (modalTermos) {
            modalTermos.style.display = "none";
        }
    };
}


// ==========================================
// USUÁRIO SALVO NO NAVEGADOR
// ==========================================

function obterUsuarioLocal() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}


// ==========================================
// CRIAR IDENTIFICADOR PELO E-MAIL
// ==========================================

async function gerarIdDoEmail(email) {
    const emailNormalizado = email.trim().toLowerCase();
    const bytes = new TextEncoder().encode(emailNormalizado);

    const hash = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(hash))
        .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        })
        .join("");
}


// ==========================================
// SESSÃO ANÔNIMA DO FIREBASE
// ==========================================

async function garantirSessaoAnonima() {
    if (!auth) {
        throw {
            code: "auth/indisponivel"
        };
    }

    if (auth.currentUser) {
        return auth.currentUser;
    }

    const credencial = await auth.signInAnonymously();

    return credencial.user;
}


// ==========================================
// CADASTRO SEM SENHA
// ==========================================

async function cadastrar() {
    const nomeInput = document.getElementById("nomeCadastro");
    const emailInput = document.getElementById("emailCadastro");
    const aceiteInput = document.getElementById("aceitarTermos");

    if (!nomeInput || !emailInput || !aceiteInput) {
        exibirAlerta(
            "error",
            "Erro",
            "Os campos do cadastro não foram encontrados."
        );

        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    if (!nome || !email) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Preencha seu nome e seu e-mail."
        );

        return;
    }

    if (!emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "E-mail inválido",
            "Informe um endereço de e-mail válido."
        );

        return;
    }

    if (!aceiteInput.checked) {
        exibirAlerta(
            "warning",
            "Aceite necessário",
            "Leia e aceite o Código de Ética e os termos de participação."
        );

        return;
    }

    if (!auth || !db) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    try {
        const usuarioAnonimo = await garantirSessaoAnonima();
        const idUsuario = await gerarIdDoEmail(email);

        const referencia = db
            .collection("usuarios")
            .doc(idUsuario);

        const cadastroExistente = await referencia.get();

        if (cadastroExistente.exists) {
            exibirAlerta(
                "info",
                "Cadastro encontrado",
                "Este e-mail já está cadastrado. Volte à tela de entrada."
            );

            return;
        }

        const dadosUsuario = {
            nome: nome,
            email: email,

            uidAnonimoInicial: usuarioAnonimo.uid,

            nivel: "Iniciante",
            pontos: 0,
            aulas: 0,
            jogos: 0,

            termosAceitos: true,
            versaoTermos: VERSAO_TERMOS,

            dataAceiteTermos:
                firebase.firestore.FieldValue.serverTimestamp(),

            dataCriacao:
                firebase.firestore.FieldValue.serverTimestamp()
        };

        await referencia.set(dadosUsuario);

        const sessaoUsuario = {
            idUsuario: idUsuario,
            nome: nome,
            email: email,
            pontos: 0,
            aulas: 0,
            jogos: 0
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(sessaoUsuario)
        );

        if (modalCadastro) {
            modalCadastro.style.display = "none";
        }

        exibirAlerta(
            "success",
            "Cadastro concluído",
            `Bem-vindo(a), ${nome}!`,
            1600,
            mostrarUsuario
        );

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);

        exibirAlerta(
            "error",
            "Erro ao cadastrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// LOGIN SOMENTE COM E-MAIL
// ==========================================

async function login() {
    const emailInput =
        document.getElementById("loginEmail") ||
        document.getElementById("loginUsuario");

    if (!emailInput) {
        exibirAlerta(
            "error",
            "Erro",
            "O campo de e-mail não foi encontrado."
        );

        return;
    }

    const email = emailInput.value.trim().toLowerCase();

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe um e-mail válido."
        );

        return;
    }

    if (!auth || !db) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    try {
        await garantirSessaoAnonima();

        const idUsuario = await gerarIdDoEmail(email);

        const documento = await db
            .collection("usuarios")
            .doc(idUsuario)
            .get();

        // Se o e-mail não estiver cadastrado,
        // abre automaticamente o cadastro.
        if (!documento.exists) {
            if (modalLogin) {
                modalLogin.style.display = "none";
            }

            if (modalCadastro) {
                modalCadastro.style.display = "flex";
            }

            const emailCadastro =
                document.getElementById("emailCadastro");

            if (emailCadastro) {
                emailCadastro.value = email;
            }

            exibirAlerta(
                "info",
                "Primeiro acesso",
                "Informe seu nome e aceite os termos para concluir o cadastro."
            );

            return;
        }

        const dados = documento.data();

        const sessaoUsuario = {
            idUsuario: idUsuario,
            nome: dados.nome,
            email: dados.email,
            pontos: dados.pontos || 0,
            aulas: dados.aulas || 0,
            jogos: dados.jogos || 0
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(sessaoUsuario)
        );

        if (modalLogin) {
            modalLogin.style.display = "none";
        }

        exibirAlerta(
            "success",
            "Bem-vindo(a)!",
            `Olá, ${dados.nome}!`,
            1600,
            mostrarUsuario
        );

    } catch (erro) {
        console.error("Erro ao entrar:", erro);

        exibirAlerta(
            "error",
            "Não foi possível entrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// MOSTRAR USUÁRIO E PROGRESSO
// ==========================================

function mostrarUsuario() {
    const usuario = obterUsuarioLocal();

    if (!usuario) {
        if (btnLogin) {
            btnLogin.innerHTML = "👤 Entrar";
        }

        return;
    }

    if (btnLogin) {
        btnLogin.innerHTML = "👤 " + usuario.nome;
    }

    const nome = document.getElementById("nomeUsuario");
    const pontos = document.getElementById("pontos");
    const aulas = document.getElementById("aulas");
    const jogos = document.getElementById("jogos");

    if (nome) {
        nome.innerText = usuario.nome;
    }

    if (pontos) {
        pontos.innerText = usuario.pontos || 0;
    }

    if (aulas) {
        aulas.innerText = usuario.aulas || 0;
    }

    if (jogos) {
        jogos.innerText = usuario.jogos || 0;
    }
}


// ==========================================
// SAIR
// ==========================================

function sair() {
    localStorage.removeItem("usuarioLogado");

    if (modalPerfil) {
        modalPerfil.style.display = "none";
    }

    if (btnLogin) {
        btnLogin.innerHTML = "👤 Entrar";
    }

    window.location.reload();
}


// ==========================================
// EXCLUIR CADASTRO
// ==========================================

async function excluirConta() {
    if (typeof Swal === "undefined") {
        return;
    }

    const resultado = await Swal.fire({
        title: "Excluir participação?",
        text: "Seus dados de perfil serão apagados permanentemente.",
        icon: "warning",

        showCancelButton: true,

        confirmColor: "#d33",
        cancelColor: "#3085d6",

        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) {
        return;
    }

    try {
        const sessao = obterUsuarioLocal();

        if (sessao && sessao.idUsuario) {
            await db
                .collection("usuarios")
                .doc(sessao.idUsuario)
                .delete();
        }

        localStorage.removeItem("usuarioLogado");

        await Swal.fire({
            icon: "success",
            title: "Dados excluídos",
            timer: 1500,
            showConfirmButton: false
        });

        window.location.reload();

    } catch (erro) {
        console.error("Erro ao excluir:", erro);

        exibirAlerta(
            "error",
            "Erro",
            "Não foi possível excluir os dados."
        );
    }
}


// ==========================================
// PESQUISA
// ==========================================

function pesquisarConteudo() {
    const campo = document.getElementById("campoPesquisa");

    if (!campo) {
        return;
    }

    const pesquisa = campo.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
        const nome = (card.dataset.nome || "").toLowerCase();

        card.style.display =
            nome.includes(pesquisa) ? "block" : "none";
    });
}


// ==========================================
// ABRIR JOGOS
// ==========================================

function abrirJogo(tipo) {
    const paginas = {
        potencia: "jogo_potencia.html",
        radiciacao: "jogoradiciacao.html",
        planocartesiano: "planocartesiano.html"
    };

    if (paginas[tipo]) {
        window.location.href = paginas[tipo];
    }
}


// ==========================================
// VOLTAR
// ==========================================

function voltarPagina() {
    history.back();
}


// ==========================================
// ALERTAS
// ==========================================

function exibirAlerta(
    icon,
    title,
    text,
    timer = null,
    callback = null
) {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            timer: timer,
            showConfirmButton: !timer
        }).then(function () {
            if (callback) {
                callback();
            }
        });

    } else {
        alert(title + ": " + text);

        if (callback) {
            callback();
        }
    }
}


// ==========================================
// ERROS DO FIREBASE
// ==========================================

function traduzirErroFirebase(codigo) {
    switch (codigo) {
        case "auth/operation-not-allowed":
            return "Ative o acesso Anônimo no Firebase Authentication.";

        case "auth/network-request-failed":
            return "Falha de conexão. Confira sua internet e tente novamente.";

        case "permission-denied":
            return "O Firebase recusou o acesso. Confira as regras do Firestore.";

        case "auth/indisponivel":
            return "O serviço de identificação não está disponível.";

        default:
            return "Ocorreu um erro. Tente novamente.";
    }
}


// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    mostrarUsuario();

    const campoPesquisa =
        document.getElementById("campoPesquisa");

    if (campoPesquisa) {
        campoPesquisa.value = "";
    }

    const formLogin =
        document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();
            login();
        });
    }

    const formCadastro =
        document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", function (evento) {
            evento.preventDefault();
            cadastrar();
        });
    }
});


// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

window.addEventListener("click", function (evento) {
    if (evento.target === modalLogin) {
        modalLogin.style.display = "none";
    }

    if (evento.target === modalCadastro) {
        modalCadastro.style.display = "none";
    }

    if (evento.target === modalPerfil) {
        modalPerfil.style.display = "none";
    }

    if (evento.target === modalTermos) {
        modalTermos.style.display = "none";
    }
});