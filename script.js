// ==========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE
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

let db, auth;

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
    console.log("🔥 Firebase inicializado com sucesso!");
} else {
    console.error("❌ SDK do Firebase não carregou no HTML.");
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

if (abrirCadastro) {
    abrirCadastro.onclick = () => {
        if (modalLogin) modalLogin.style.display = "none";
        if (modalCadastro) modalCadastro.style.display = "flex";
    };
}

// ==========================================
// FUNÇÃO DE CADASTRO (Firebase Auth + Firestore)
// ==========================================
async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) {
        exibirAlerta('error', 'Erro', 'Campos do formulário não encontrados.');
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!nome || !email || !senha) {
        exibirAlerta('warning', 'Atenção', 'Preencha todos os campos do cadastro!');
        return;
    }

    if (!auth || !db) {
        exibirAlerta('error', 'Erro', 'Serviço do Firebase não disponível.');
        return;
    }

    try {
        // 1. Cria usuário no Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
        const user = userCredential.user;

        // 2. Atualiza o perfil no Auth com o nome fornecido
        await user.updateProfile({ displayName: nome });

        // 3. Salva os dados complementares no Firestore (sem salvar a senha)
        const dadosUsuario = {
            uid: user.uid,
            nome: nome,
            email: email,
            nivel: "Iniciante",
            pontos: 0,
            dataCriacao: new Date()
        };

        await db.collection("usuarios").doc(user.uid).set(dadosUsuario);

        // 4. Grava a sessão localmente
        localStorage.setItem("usuarioLogado", JSON.stringify({ nome, email, pontos: 0 }));

        exibirAlerta('success', 'Sucesso!', 'Cadastro realizado com sucesso!', 1500, () => {
            window.location.reload();
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
    const emailInput = document.getElementById("emailLogin") || document.getElementById("loginUsuario");
    const senhaInput = document.getElementById("senhaLogin");

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
        exibirAlerta('warning', 'Atenção', 'Informe e-mail e senha para entrar.');
        return;
    }

    if (!auth) {
        exibirAlerta('error', 'Erro', 'Serviço do Firebase não disponível.');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, senha);
        const user = userCredential.user;

        // Busca dados do perfil no Firestore
        let pontos = 0;
        let nome = user.displayName || user.email.split("@")[0];

        const docSnap = await db.collection("usuarios").doc(user.uid).get();
        if (docSnap.exists) {
            const dadosDoc = docSnap.data();
            pontos = dadosDoc.pontos || 0;
            if (dadosDoc.nome) nome = dadosDoc.nome;
        }

        const sessaoUsuario = { nome, email: user.email, pontos };
        localStorage.setItem("usuarioLogado", JSON.stringify(sessaoUsuario));

        if (modalLogin) modalLogin.style.display = "none";

        exibirAlerta('success', 'Bem-vindo(a)!', `Olá, ${nome}!`, 1800, () => {
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

        if (elemNome) elemNome.innerText = usuario.nome;
        if (elemPontos) elemPontos.innerText = usuario.pontos || 0;
    } else {
        if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    }
}

function sair() {
    if (auth) auth.signOut();
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
            const user = auth.currentUser;
            if (user) {
                await db.collection("usuarios").doc(user.uid).delete();
                await user.delete();
            }
            localStorage.clear();
            
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
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'E-mail ou senha incorretos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está cadastrado.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/invalid-email':
            return 'E-mail inválido.';
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
        const campoEmail = document.getElementById("emailLogin");
        const campoSenha = document.getElementById("senhaLogin");
        if (campoEmail) campoEmail.value = "";
        if (campoSenha) campoSenha.value = "";
    }, 150);
});
