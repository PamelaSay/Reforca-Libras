// ==========================================
// 1. CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE
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

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
}

// Helper para alertas simples
function exibirAlerta(icone, titulo, texto) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: icone, title: titulo, text: texto, confirmButtonColor: '#d4af37' });
    } else {
        alert(`${titulo}: ${texto}`);
    }
}

// ==========================================
// 2. INICIALIZAÇÃO SEGURA DA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Apenas configura a busca quando o usuário REALMENTE digitar
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.value = ""; // Limpa para não vir e-mail do navegador
        campoPesquisa.addEventListener("input", pesquisarConteudo);
    }

    // Configura os modais e botões de login/perfil
    configurarModais();

    // Configura o clique das estrelas de forma isolada (sem sumir com os cards)
    configurarEstrelasSeguro();

    // Atualiza botão de login/nome na tela
    mostrarUsuario();
});

// ==========================================
// 3. AVALIAÇÃO COM ESTRELAS (ISOLADO E SEGURO)
// ==========================================
function configurarEstrelasSeguro() {
    // Procura elementos com classe 'estrela' ou dentro de contêineres de estrelas
    const elementosEstrela = document.querySelectorAll('.estrelas i, .estrelas span, .estrela, [data-estrela]');

    elementosEstrela.forEach((estrela, index) => {
        estrela.addEventListener('click', (e) => {
            // IMPEDE que o clique afete o card pai ou recarregue a página
            e.preventDefault();
            e.stopPropagation();

            const container = estrela.parentElement;
            if (!container) return;

            const todasEstrelas = container.children;
            let posicaoClicada = Array.from(todasEstrelas).indexOf(estrela);

            // Se não achou pelo indice dos filhos, usa o index relativo
            if (posicaoClicada === -1) posicaoClicada = index;

            // Pinta apenas a cor da estrela, SEM alterar a exibição/classes do Card
            for (let i = 0; i < todasEstrelas.length; i++) {
                if (i <= posicaoClicada) {
                    todasEstrelas[i].style.color = "#FFD700"; // Dourado
                } else {
                    todasEstrelas[i].style.color = "#CCC"; // Cinza
                }
            }
        });
    });
}

// ==========================================
// 4. BUSCA (SÓ FILTRA SE DIGITAR)
// ==========================================
function pesquisarConteudo() {
    const campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    const termo = campo.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card, .card-jogo");

    cards.forEach(card => {
        // Se o campo estiver vazio, MOSTRA todos os cards obrigatoriamente
        if (termo === "") {
            card.style.display = "";
            return;
        }

        const texto = card.innerText.toLowerCase();
        if (texto.includes(termo)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

// ==========================================
// 5. LOGIN E CADASTRO (FIRESTORE)
// ==========================================
async function login() {
    const campoLogin = document.getElementById("loginUsuario") || document.getElementById("emailLogin");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoLogin || !campoSenha) return;

    const valorLogin = campoLogin.value.trim().toLowerCase();
    const senhaDigitada = campoSenha.value;

    if (!valorLogin || !senhaDigitada) {
        exibirAlerta('warning', 'Atenção', 'Preencha o e-mail/usuário e a senha.');
        return;
    }

    try {
        let snapshot = await db.collection("usuarios").where("email", "==", valorLogin).get();

        if (snapshot.empty) {
            snapshot = await db.collection("usuarios").where("nome", "==", campoLogin.value.trim()).get();
        }

        if (snapshot.empty) {
            exibirAlerta('error', 'Erro', 'Usuário não encontrado.');
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
            exibirAlerta('success', 'Sucesso', `Bem-vindo, ${usuarioEncontrado.nome}!`);
            setTimeout(() => location.reload(), 1000);
        } else {
            exibirAlerta('error', 'Erro', 'Senha incorreta.');
        }
    } catch (err) {
        exibirAlerta('error', 'Erro', 'Falha ao conectar com o banco.');
    }
}

async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) return;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;

    if (!nome || !email || !senha) {
        exibirAlerta('warning', 'Atenção', 'Preencha todos os campos!');
        return;
    }

    try {
        const snapshot = await db.collection("usuarios").where("email", "==", email).get();
        if (!snapshot.empty) {
            exibirAlerta('error', 'Erro', 'E-mail já cadastrado.');
            return;
        }

        const novoUsuario = { nome, email, senha, nivel: "Iniciante", pontos: 0 };
        const docRef = await db.collection("usuarios").add(novoUsuario);
        novoUsuario.id = docRef.id;

        localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
        exibirAlerta('success', 'Sucesso', 'Conta criada com sucesso!');
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        exibirAlerta('error', 'Erro', 'Não foi possível cadastrar.');
    }
}

// ==========================================
// 6. GERENCIAMENTO DE MODAIS E NAVEGAÇÃO
// ==========================================
function configurarModais() {
    const btnLogin = document.getElementById("btnLogin");
    const modalLogin = document.getElementById("modalLogin");
    const fecharLogin = document.getElementById("fecharLogin");

    const abrirCadastro = document.getElementById("abrirCadastro");
    const modalCadastro = document.getElementById("modalCadastro");
    const fecharCadastro = document.getElementById("fecharCadastro");

    const modalPerfil = document.getElementById("modalPerfil");
    const fecharPerfil = document.getElementById("fecharPerfil");

    if (btnLogin) {
        btnLogin.onclick = (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("usuarioLogado"));
            if (user && modalPerfil) modalPerfil.style.display = "flex";
            else if (modalLogin) modalLogin.style.display = "flex";
        };
    }

    if (fecharLogin) fecharLogin.onclick = () => modalLogin.style.display = "none";
    if (fecharCadastro) fecharCadastro.onclick = () => modalCadastro.style.display = "none";
    if (fecharPerfil) fecharPerfil.onclick = () => modalPerfil.style.display = "none";

    if (abrirCadastro) {
        abrirCadastro.onclick = (e) => {
            e.preventDefault();
            if (modalLogin) modalLogin.style.display = "none";
            if (modalCadastro) modalCadastro.style.display = "flex";
        };
    }

    const formLogin = document.getElementById("formLogin");
    if (formLogin) formLogin.onsubmit = (e) => { e.preventDefault(); login(); };

    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) formCadastro.onsubmit = (e) => { e.preventDefault(); cadastrar(); };
}

function mostrarUsuario() {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));
    const btnLogin = document.getElementById("btnLogin");
    const elemNome = document.getElementById("nomeUsuario");

    if (user) {
        if (btnLogin) btnLogin.innerHTML = "👤 " + user.nome;
        if (elemNome) elemNome.innerText = user.nome;
    } else {
        if (btnLogin) btnLogin.innerHTML = "👤 Entrar";
    }
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    location.reload();
}

function alternarSenha(idCampo, el) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    campo.type = campo.type === "password" ? "text" : "password";
}

function abrirJogo(tipo) {
    const rotas = {
        'potencia': 'jogo_potencia.html',
        'radiciacao': 'jogoradiciacao.html',
        'planocartesiano': 'planocartesiano.html'
    };
    if (rotas[tipo]) window.location.href = rotas[tipo];
}

function voltarPagina() {
    history.back();
}
