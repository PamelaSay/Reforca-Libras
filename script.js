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

let db = null;

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    console.log("🔥 Firebase inicializado no GitHub Pages!");
} else {
    console.error("❌ SDK do Firebase não foi carregado no HTML.");
}

// ==========================================
// MENSAGENS E ALERTAS (COMPATÍVEL COM SWEETALERT2)
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
// GERENCIAMENTO DE MODAIS E NAVEGAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const modalLogin = document.getElementById("modalLogin");
    const fecharLogin = document.getElementById("fecharLogin");

    const abrirCadastro = document.getElementById("abrirCadastro");
    const modalCadastro = document.getElementById("modalCadastro");
    const fecharCadastro = document.getElementById("fecharCadastro");

    const modalPerfil = document.getElementById("modalPerfil");
    const fecharPerfil = document.getElementById("fecharPerfil");

    // Botão de Login / Perfil no cabeçalho
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

    // Fechar Modais
    if (fecharLogin) fecharLogin.onclick = () => modalLogin.style.display = "none";
    if (fecharCadastro) fecharCadastro.onclick = () => modalCadastro.style.display = "none";
    if (fecharPerfil) fecharPerfil.onclick = () => modalPerfil.style.display = "none";

    // Transição de Login para Cadastro
    if (abrirCadastro) {
        abrirCadastro.onclick = () => {
            if (modalLogin) modalLogin.style.display = "none";
            if (modalCadastro) modalCadastro.style.display = "flex";
        };
    }

    // Campo de busca em tempo real (se existir na página)
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", pesquisarConteudo);
    }

    // Carrega dados da sessão atual
    mostrarUsuario();
});

// ==========================================
// CADASTRO DE USUÁRIO (FIRESTORE)
// ==========================================
async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) {
        exibirAlerta('error', 'Erro', 'Campos de cadastro não encontrados.');
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
        exibirAlerta('error', 'Erro', 'Banco de dados inacessível. Verifique os scripts do Firebase.');
        return;
    }

    try {
        // 1. Verifica no Firestore se o e-mail já existe no banco global
        const snapshot = await db.collection("usuarios").where("email", "==", email).get();
        if (!snapshot.empty) {
            exibirAlerta('error', 'E-mail já cadastrado', 'Já existe uma conta com este e-mail.');
            return;
        }

        // 2. Prepara o objeto do novo usuário
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            nivel: "Iniciante",
            pontos: 0,
            dataCriacao: new Date()
        };

        // 3. Salva no Firestore
        const docRef = await db.collection("usuarios").add(novoUsuario);
        
        // Inclui o ID gerado pelo Firebase na sessão local
        novoUsuario.id = docRef.id;
        localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

        exibirAlerta('success', 'Sucesso!', 'Cadastro realizado com sucesso!', 1500);
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        exibirAlerta('error', 'Erro', 'Falha ao salvar no banco de dados: ' + error.message);
    }
}

// ==========================================
// LOGIN DE USUÁRIO (CONSULTA AO FIRESTORE)
// ==========================================
async function login() {
    const campoLogin = document.getElementById("loginUsuario");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoLogin || !campoSenha) return;

    const loginDigitado = campoLogin.value.trim().toLowerCase();
    const senhaDigitada = campoSenha.value;

    if (!loginDigitado || !senhaDigitada) {
        exibirAlerta('warning', 'Atenção', 'Digite o e-mail/usuário e a senha.');
        return;
    }

    if (!db) {
        exibirAlerta('error', 'Erro', 'Banco de dados indisponível.');
        return;
    }

    try {
        // 1. Busca por e-mail no Firestore
        let snapshot = await db.collection("usuarios").where("email", "==", loginDigitado).get();

        // 2. Se não achar por e-mail, busca por nome de usuário
        if (snapshot.empty) {
            snapshot = await db.collection("usuarios").where("nome", "==", campoLogin.value.trim()).get();
        }

        if (snapshot.empty) {
            exibirAlerta('info', 'Conta não encontrada', 'Nenhum usuário cadastrado com estes dados.');
            return;
        }

        // 3. Valida a senha
        let usuarioEncontrado = null;
        snapshot.forEach(doc => {
            const dados = doc.data();
            if (dados.senha === senhaDigitada) {
                usuarioEncontrado = { id: doc.id, ...dados };
            }
        });

        if (usuarioEncontrado) {
            // Salva a sessão no localStorage
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
            
            exibirAlerta('success', 'Bem-vindo(a)!', `Olá, ${usuarioEncontrado.nome}!`, 1500);

            setTimeout(() => {
                const modalLogin = document.getElementById("modalLogin");
                if (modalLogin) modalLogin.style.display = "none";
                mostrarUsuario();
            }, 1500);
        } else {
            exibirAlerta('error', 'Senha incorreta', 'A senha digitada está incorreta.');
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        exibirAlerta('error', 'Erro', 'Falha ao conectar com o servidor.');
    }
}

// ==========================================
// RECUPERAÇÃO DE SENHA (FIRESTORE)
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
        confirmButtonText: 'Buscar Senha',
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
            console.error("Erro ao recuperar senha:", error);
            exibirAlerta('error', 'Erro', 'Falha ao buscar dados no banco.');
        }
    }
}

// ==========================================
// EXIBIR DADOS NA INTERFACE (SESSÃO)
// ==========================================
function mostrarUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const btnLogin = document.getElementById("btnLogin");
    const elemNome = document.getElementById("nomeUsuario");
    const elemPontos = document.getElementById("pontos");

    if (usuario) {
        if (btnLogin) btnLogin.innerHTML = "👤 " + usuario.nome;
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
    const modalPerfil = document.getElementById("modalPerfil");
    if (modalPerfil) modalPerfil.style.display = "none";
    mostrarUsuario();
    window.location.reload();
}

async function excluirConta() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) return;

    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Excluir conta?',
            text: "Esta ação apagará seu perfil do banco de dados definitivamente!",
            icon: 'warning',
            showCancelButton: true,
            confirmColor: '#d33',
            cancelColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            if (usuario.id && db) {
                try {
                    // Remove do Firestore pelo ID do documento
                    await db.collection("usuarios").doc(usuario.id).delete();
                } catch (e) {
                    console.error("Erro ao excluir do Firestore:", e);
                }
            }

            localStorage.removeItem("usuarioLogado");
            exibirAlerta('success', 'Excluído!', 'Sua conta foi removida com sucesso.', 1500);
            setTimeout(() => window.location.reload(), 1500);
        }
    }
}

// ==========================================
// UTILITÁRIOS (SENHA, BUSCA E JOGOS)
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
