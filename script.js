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

// Inicializa o Firebase SDK
let db = null;
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("🔥 Firebase inicializado com sucesso!");
} else {
    console.error("❌ SDK do Firebase não carregou no HTML.");
}

// ==========================================
// MENSAGENS E ALERTAS (SWEETALERT2 FALLBACK)
// ==========================================
function exibirAlerta(icone, titulo, texto, timer = null) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: icone,
            title: titulo,
            text: texto,
            timer: timer,
            showConfirmButton: !timer
        });
    } else {
        alert(`${titulo}: ${texto}`);
    }
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

// Eventos de Abertura e Fechamento
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
// FUNÇÃO DE CADASTRO (Firestore + Session)
// ==========================================
async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) {
        exibirAlerta('error', 'Erro', 'Campos de cadastro não encontrados no formulário.');
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;

    if (!nome || !email || !senha) {
        exibirAlerta('warning', 'Atenção', 'Preencha todos os campos do cadastro!');
        return;
    }

    if (!db) {
        exibirAlerta('error', 'Erro', 'Sem conexão com o banco de dados Firebase.');
        return;
    }

    try {
        // Verifica se o e-mail já existe
        const snapshot = await db.collection("usuarios").where("email", "==", email).get();
        if (!snapshot.empty) {
            exibirAlerta('error', 'E-mail em uso', 'Este e-mail já está cadastrado.');
            return;
        }

        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            nivel: "Iniciante",
            pontos: 0,
            dataCriacao: new Date()
        };

        const docRef = await db.collection("usuarios").add(novoUsuario);
        novoUsuario.id = docRef.id;

        localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

        exibirAlerta('success', 'Sucesso!', 'Cadastro realizado com sucesso!', 1500);
        setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        exibirAlerta('error', 'Erro', 'Falha ao realizar cadastro: ' + error.message);
    }
}

// ==========================================
// FUNÇÃO DE LOGIN (Consulta Firestore)
// ==========================================
async function login() {
    const campoLogin = document.getElementById("loginUsuario");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoLogin || !campoSenha) return;

    const loginDigitado = campoLogin.value.trim().toLowerCase();
    const senhaDigitada = campoSenha.value;

    if (!loginDigitado || !senhaDigitada) {
        exibirAlerta('warning', 'Atenção', 'Preencha o usuário/e-mail e a senha.');
        return;
    }

    if (!db) {
        exibirAlerta('error', 'Erro', 'Banco de dados indisponível.');
        return;
    }

    try {
        // Busca por e-mail no Firestore
        let snapshot = await db.collection("usuarios").where("email", "==", loginDigitado).get();

        // Se não achar por e-mail, busca por nome de usuário
        if (snapshot.empty) {
            snapshot = await db.collection("usuarios").where("nome", "==", campoLogin.value.trim()).get();
        }

        if (snapshot.empty) {
            exibirAlerta('info', 'Conta não encontrada', 'E-mail ou usuário não possui cadastro.');
            return;
        }

        let usuarioEncontrado = null;
        snapshot.forEach(doc => {
            const dados = doc.data();
            if (dados.senha === senhaDigitada) {
                usuarioEncontrado = { id: doc.id, ...dados };
            }
        });

        if (usuarioEncontrado) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
            exibirAlerta('success', 'Bem-vindo(a)!', `Olá, ${usuarioEncontrado.nome}!`, 1500);
            
            setTimeout(() => {
                if (modalLogin) modalLogin.style.display = "none";
                mostrarUsuario();
            }, 1500);
        } else {
            exibirAlerta('error', 'Erro', 'Senha incorreta!');
        }

    } catch (error) {
        console.error("Erro no login:", error);
        exibirAlerta('error', 'Erro', 'Falha ao autenticar.');
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
// ESQUECEU SUA SENHA
// ==========================================
async function esqueceuSenha(event) {
    if (event) event.preventDefault();

    if (typeof Swal === 'undefined') {
        alert("Recurso indisponível no momento.");
        return;
    }

    const { value: emailDigitado } = await Swal.fire({
        title: 'Recuperação de Senha',
        text: 'Digite o e-mail cadastrado na sua conta:',
        input: 'email',
        inputPlaceholder: 'seu.email@exemplo.com',
        showCancelButton: true,
        confirmButtonText: 'Verificar',
        cancelButtonText: 'Cancelar'
    });

    if (emailDigitado && db) {
        try {
            const snapshot = await db.collection("usuarios")
                .where("email", "==", emailDigitado.trim().toLowerCase())
                .get();

            if (!snapshot.empty) {
                const usuario = snapshot.docs[0].data();
                Swal.fire({
                    icon: 'success',
                    title: 'Senha Encontrada!',
                    html: `Sua senha cadastrada é: <strong>${usuario.senha}</strong>`
                });
            } else {
                exibirAlerta('error', 'Não encontrado', 'Nenhuma conta encontrada com este e-mail.');
            }
        } catch (error) {
            console.error("Erro na recuperação:", error);
            exibirAlerta('error', 'Erro', 'Falha ao consultar banco de dados.');
        }
    }
}

// ==========================================
// MOSTRAR USUÁRIO LOGADO E PERFIL
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

// ==========================================
// SAIR E EXCLUIR CONTA
// ==========================================
function sair() {
    localStorage.removeItem("usuarioLogado");
    if (modalPerfil) modalPerfil.style.display = "none";
    if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    window.location.reload();
}

async function excluirConta() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Sua conta será apagada permanentemente do banco de dados!",
            icon: 'warning',
            showCancelButton: true,
            confirmColor: '#d33',
            cancelColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            if (usuario && usuario.id && db) {
                try {
                    await db.collection("usuarios").doc(usuario.id).delete();
                } catch (e) {
                    console.error("Erro ao remover do Firestore:", e);
                }
            }

            localStorage.removeItem("usuarioLogado");

            if (modalPerfil) modalPerfil.style.display = "none";
            if (btnLogin) btnLogin.innerHTML = "👤 Entrar";

            exibirAlerta('success', 'Excluído!', 'Sua conta foi removida com sucesso.', 1500);
            setTimeout(() => window.location.reload(), 1500);
        }
    }
}

// ==========================================
// PESQUISAR CONTEÚDO (MELHORADO)
// ==========================================
function pesquisarConteudo() {
    const campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    const pesquisa = campo.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const nomeData = card.dataset.nome ? card.dataset.nome.toLowerCase() : "";
        const titulo = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        const texto = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";

        if (nomeData.includes(pesquisa) || titulo.includes(pesquisa) || texto.includes(pesquisa)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

// ==========================================
// ABRIR JOGOS E NAVEGAÇÃO
// ==========================================
function abrirJogo(tipo) {
    const rotas = {
        'potencia': 'jogo_potencia.html',
        'radiciacao': 'jogoradiciacao.html',
        'planocartesiano': 'planocartesiano.html'
    };

    if (rotas[tipo]) {
        window.location.href = rotas[tipo];
    }
}

function voltarPagina() {
    history.back();
}

// ==========================================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();

    // Evento de busca em tempo real se o campo existir
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", pesquisarConteudo);
    }
});
