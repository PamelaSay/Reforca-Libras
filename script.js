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

try {
    if (typeof firebase === "undefined") {
        throw new Error("Firebase não foi carregado pelo HTML.");
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();
    auth = firebase.auth();

    console.log("Firebase iniciado corretamente.");

} catch (erro) {
    console.error("Erro ao iniciar o Firebase:", erro);
}

const VERSAO_TERMOS = "1.0";


// ==========================================
// ELEMENTOS DOS MODAIS
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
// ABRIR LOGIN OU PERFIL
// ==========================================

if (btnLogin) {
    btnLogin.onclick = function () {
        const usuarioLogado = obterUsuarioLocal();

        if (usuarioLogado) {
            mostrarPerfil();
        } else if (modalLogin) {
            modalLogin.style.display = "flex";
        }
    };
}


// ==========================================
// FECHAR MODAIS
// ==========================================

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


// ==========================================
// ABRIR CADASTRO
// ==========================================

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


// ==========================================
// CÓDIGO DE ÉTICA
// ==========================================

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
// CADASTRAR USUÁRIO
// ==========================================

async function cadastrar() {
    const nomeInput = document.getElementById("nomeCadastro");
    const emailInput = document.getElementById("emailCadastro");
    const senhaInput = document.getElementById("senhaCadastro");
    const aceiteInput = document.getElementById("aceitarTermos");

    if (!nomeInput || !emailInput || !senhaInput || !aceiteInput) {
        exibirAlerta(
            "error",
            "Erro",
            "Os campos do cadastro não foram encontrados."
        );

        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;

    if (!nome) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe seu nome."
        );

        return;
    }

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe um e-mail válido."
        );

        return;
    }

    if (senha.length < 6) {
        exibirAlerta(
            "warning",
            "Atenção",
            "A senha deve ter pelo menos 6 caracteres."
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

    let usuarioCriado = null;

    try {
        // Mantém a pessoa conectada depois de fechar o navegador.
        await auth.setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        );

        /*
         * A senha é enviada diretamente ao Firebase Authentication.
         * Ela não será gravada no Firestore.
         */
        const credencial =
            await auth.createUserWithEmailAndPassword(
                email,
                senha
            );

        usuarioCriado = credencial.user;

        // Guarda o nome no perfil do Firebase Authentication.
        await usuarioCriado.updateProfile({
            displayName: nome
        });

        /*
         * Dados que serão armazenados no Firestore.
         * Observe que não existe nenhum campo chamado "senha".
         */
        const dadosUsuario = {
            uid: usuarioCriado.uid,
            nome: nome,
            email: email,
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

        try {
            await db
                .collection("usuarios")
                .doc(usuarioCriado.uid)
                .set(dadosUsuario);

        } catch (erroFirestore) {
            /*
             * Se o Firestore recusar a gravação, excluímos a conta
             * recém-criada para não deixar um cadastro incompleto.
             */
            await usuarioCriado.delete();

            throw erroFirestore;
        }

        const sessaoUsuario = {
            uid: usuarioCriado.uid,
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

        limparFormularioCadastro();
        mostrarUsuario();

        exibirAlerta(
            "success",
            "Cadastro concluído!",
            `Bem-vindo(a), ${nome}!`,
            1600
        );

    } catch (erro) {
        console.error("Erro no cadastro:", erro);

        exibirAlerta(
            "error",
            "Erro ao cadastrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// LOGIN
// ==========================================

async function login() {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("senhaLogin");

    if (!emailInput || !senhaInput) {
        exibirAlerta(
            "error",
            "Erro",
            "Os campos de login não foram encontrados."
        );

        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe um e-mail válido."
        );

        return;
    }

    if (!senha) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe sua senha."
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
        await auth.setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        );

        const credencial =
            await auth.signInWithEmailAndPassword(
                email,
                senha
            );

        const usuario = credencial.user;

        const referencia = db
            .collection("usuarios")
            .doc(usuario.uid);

        const documento = await referencia.get();

        let dadosUsuario;

        if (documento.exists) {
            dadosUsuario = documento.data();

            /*
             * Se uma versão antiga do site salvou a senha no
             * Firestore, este trecho apaga somente esse campo.
             */
            if (
                Object.prototype.hasOwnProperty.call(
                    dadosUsuario,
                    "senha"
                )
            ) {
                await referencia.update({
                    senha:
                        firebase.firestore.FieldValue.delete()
                });

                delete dadosUsuario.senha;
            }

        } else {
            /*
             * Caso a conta exista no Authentication, mas ainda não
             * tenha um documento no Firestore, o perfil é recriado.
             */
            dadosUsuario = {
                uid: usuario.uid,

                nome:
                    usuario.displayName ||
                    email.split("@")[0],

                email: usuario.email,

                nivel: "Iniciante",
                pontos: 0,
                aulas: 0,
                jogos: 0,

                termosAceitos: false,

                dataCriacao:
                    firebase.firestore.FieldValue.serverTimestamp()
            };

            await referencia.set(dadosUsuario);
        }

        const sessaoUsuario = {
            uid: usuario.uid,

            nome:
                dadosUsuario.nome ||
                usuario.displayName ||
                email.split("@")[0],

            email: usuario.email,

            pontos: dadosUsuario.pontos || 0,
            aulas: dadosUsuario.aulas || 0,
            jogos: dadosUsuario.jogos || 0
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(sessaoUsuario)
        );

        if (modalLogin) {
            modalLogin.style.display = "none";
        }

        limparFormularioLogin();
        mostrarUsuario();

        exibirAlerta(
            "success",
            "Bem-vindo(a)!",
            `Olá, ${sessaoUsuario.nome}!`,
            1600
        );

    } catch (erro) {
        console.error("Erro no login:", erro);

        exibirAlerta(
            "error",
            "Não foi possível entrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// MOSTRAR NOME DO USUÁRIO
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

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    const pontos =
        document.getElementById("pontos");

    const aulas =
        document.getElementById("aulas");

    const jogos =
        document.getElementById("jogos");

    if (nomeUsuario) {
        nomeUsuario.innerText = usuario.nome;
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
// MOSTRAR PERFIL
// ==========================================

function mostrarPerfil() {
    const usuario = obterUsuarioLocal();

    if (!usuario) {
        if (modalLogin) {
            modalLogin.style.display = "flex";
        }

        return;
    }

    mostrarUsuario();

    if (modalPerfil) {
        modalPerfil.style.display = "flex";
    }
}


// ==========================================
// SAIR
// ==========================================

async function sair() {
    try {
        if (auth) {
            await auth.signOut();
        }
    } catch (erro) {
        console.error("Erro ao encerrar sessão:", erro);
    }

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
// EXCLUIR CONTA
// ==========================================

async function excluirConta() {
    if (typeof Swal === "undefined") {
        return;
    }

    const resultado = await Swal.fire({
        title: "Excluir conta?",
        text:
            "Seu cadastro e seus dados de perfil serão " +
            "apagados permanentemente.",

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
        if (!auth || !auth.currentUser) {
            exibirAlerta(
                "warning",
                "Entre novamente",
                "Faça login novamente antes de excluir sua conta."
            );

            return;
        }

        const usuario = auth.currentUser;

        await db
            .collection("usuarios")
            .doc(usuario.uid)
            .delete();

        await usuario.delete();

        localStorage.removeItem("usuarioLogado");

        await Swal.fire({
            icon: "success",
            title: "Conta excluída",
            text: "Seu cadastro foi removido.",
            timer: 1500,
            showConfirmButton: false
        });

        window.location.reload();

    } catch (erro) {
        console.error("Erro ao excluir conta:", erro);

        if (erro.code === "auth/requires-recent-login") {
            exibirAlerta(
                "warning",
                "Entre novamente",
                "Por segurança, saia, entre novamente e repita a exclusão."
            );

            return;
        }

        exibirAlerta(
            "error",
            "Erro ao excluir",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// RECUPERAR SENHA
// ==========================================

async function esqueceuSenha(evento) {
    if (evento) {
        evento.preventDefault();
    }

    if (!auth) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    let email = "";

    const campoEmail =
        document.getElementById("loginEmail");

    if (campoEmail) {
        email = campoEmail.value.trim().toLowerCase();
    }

    if (typeof Swal === "undefined") {
        if (!email) {
            email = prompt(
                "Digite o e-mail usado no cadastro:"
            );
        }

        if (!email) {
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);

            alert(
                "O link de redefinição foi enviado para seu e-mail."
            );

        } catch (erro) {
            alert(traduzirErroFirebase(erro.code));
        }

        return;
    }

    const resultado = await Swal.fire({
        title: "Recuperar senha",

        text:
            "Informe o e-mail usado no cadastro para receber " +
            "o link de redefinição.",

        input: "email",
        inputValue: email,

        inputPlaceholder: "seuemail@exemplo.com",

        showCancelButton: true,

        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",

        inputValidator: function (valor) {
            if (!valor) {
                return "Informe seu e-mail.";
            }
        }
    });

    if (!resultado.isConfirmed) {
        return;
    }

    try {
        await auth.sendPasswordResetEmail(
            resultado.value.trim().toLowerCase()
        );

        exibirAlerta(
            "success",
            "E-mail enviado",
            "Confira sua caixa de entrada e a pasta de spam."
        );

    } catch (erro) {
        console.error(
            "Erro ao enviar recuperação de senha:",
            erro
        );

        exibirAlerta(
            "error",
            "Não foi possível enviar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// LIMPAR FORMULÁRIOS
// ==========================================

function limparFormularioLogin() {
    const formulario =
        document.getElementById("formLogin");

    if (formulario) {
        formulario.reset();
    }
}

function limparFormularioCadastro() {
    const formulario =
        document.getElementById("formCadastro");

    if (formulario) {
        formulario.reset();
    }
}


// ==========================================
// PESQUISA
// ==========================================

function pesquisarConteudo() {
    const campo =
        document.getElementById("campoPesquisa");

    if (!campo) {
        return;
    }

    const pesquisa =
        campo.value.trim().toLowerCase();

    const cards =
        document.querySelectorAll(".card");

    cards.forEach(function (card) {
        const nome =
            card.dataset.nome
                ? card.dataset.nome.toLowerCase()
                : "";

        card.style.display =
            nome.includes(pesquisa)
                ? "block"
                : "none";
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
// VOLTAR PÁGINA
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
// TRADUZIR ERROS DO FIREBASE
// ==========================================

function traduzirErroFirebase(codigo) {
    switch (codigo) {
        case "auth/invalid-email":
            return "O e-mail informado é inválido.";

        case "auth/email-already-in-use":
            return (
                "Este e-mail já possui cadastro. " +
                "Entre usando seu e-mail e sua senha."
            );

        case "auth/weak-password":
            return "A senha deve ter pelo menos 6 caracteres.";

        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "E-mail ou senha incorretos.";

        case "auth/operation-not-allowed":
            return (
                "Ative o provedor E-mail/senha " +
                "no Firebase Authentication."
            );

        case "auth/too-many-requests":
            return (
                "Muitas tentativas foram realizadas. " +
                "Aguarde alguns minutos."
            );

        case "auth/network-request-failed":
            return (
                "Falha de conexão. Confira sua internet " +
                "e tente novamente."
            );

        case "auth/unauthorized-domain":
            return (
                "O domínio deste site não está autorizado " +
                "no Firebase Authentication."
            );

        case "auth/requires-recent-login":
            return (
                "Por segurança, saia e entre novamente " +
                "antes de realizar essa operação."
            );

        case "permission-denied":
            return (
                "O Firestore recusou o acesso. " +
                "Confira as regras do banco."
            );

        default:
            if (codigo) {
                return "O Firebase retornou o erro: " + codigo;
            }

            return (
                "Ocorreu um erro. Abra o Console do navegador " +
                "para conferir os detalhes."
            );
    }
}


// ==========================================
// EVENTOS DOS FORMULÁRIOS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        mostrarUsuario();

        const campoPesquisa =
            document.getElementById("campoPesquisa");

        if (campoPesquisa) {
            campoPesquisa.value = "";
        }

        const formLogin =
            document.getElementById("formLogin");

        if (formLogin) {
            formLogin.addEventListener(
                "submit",
                function (evento) {
                    evento.preventDefault();
                    login();
                }
            );
        }

        const formCadastro =
            document.getElementById("formCadastro");

        if (formCadastro) {
            formCadastro.addEventListener(
                "submit",
                function (evento) {
                    evento.preventDefault();
                    cadastrar();
                }
            );
        }
    }
);


// ==========================================
// ACOMPANHAR ESTADO DO FIREBASE
// ==========================================

if (auth) {
    auth.onAuthStateChanged(
        async function (usuarioFirebase) {
            if (!usuarioFirebase) {
                /*
                 * Não apagamos aqui imediatamente para evitar conflito
                 * durante o carregamento inicial. O botão será ajustado
                 * pela sessão local.
                 */
                return;
            }

            try {
                const documento = await db
                    .collection("usuarios")
                    .doc(usuarioFirebase.uid)
                    .get();

                if (!documento.exists) {
                    return;
                }

                const dados = documento.data();

                const sessao = {
                    uid: usuarioFirebase.uid,

                    nome:
                        dados.nome ||
                        usuarioFirebase.displayName ||
                        usuarioFirebase.email.split("@")[0],

                    email: usuarioFirebase.email,

                    pontos: dados.pontos || 0,
                    aulas: dados.aulas || 0,
                    jogos: dados.jogos || 0
                };

                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(sessao)
                );

                mostrarUsuario();

            } catch (erro) {
                console.error(
                    "Erro ao recuperar sessão do usuário:",
                    erro
                );
            }
        }
    );
}


// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

window.addEventListener(
    "click",
    function (evento) {
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
    }
);