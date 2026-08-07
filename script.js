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
    console.log("🔥 Firebase conectado com sucesso!");
} else {
    console.error("❌ SDK do Firebase não encontrado no HTML.");
}

// ==========================================
// ALERTAS E NOTIFICAÇÕES
// ==========================================
function exibirAlerta(icone, titulo, texto, timer = null) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: icone,
            title: titulo,
            text: texto,
            timer: timer,
            showConfirmButton: !timer,
            confirmButtonColor: '#d4af37'
        });
    } else {
        alert(`${titulo}: ${texto}`);
    }
}

// ==========================================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Limpa o campo de busca para evitar autopreenchimento de e-mail pelo navegador
    corrigirCampoBusca();

    // 2. Inicializa o sistema de clique e pintura das estrelas
    inicializarSistemaEstrelas();

    // 3. Configura botões de modais e eventos de formulário
    configurarEventosModais();

    // 4. Carrega sessão do usuário se existir
    mostrarUsuario();
});

// ==========================================
// FIX 1: CAMPO DE BUSCA (BLOQUEIA AUTOFILL DE E-MAIL)
// ==========================================
function corrigirCampoBusca() {
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        // Força o campo a iniciar limpo
        campoPesquisa.value = "";
        campoPesquisa.setAttribute("autocomplete", "off");
        campoPesquisa.addEventListener("input", pesquisarConteudo);
    }
}

// ==========================================
// FIX 2: SISTEMA DE AVALIAÇÃO COM ESTRELAS
// ==========================================
function inicializarSistemaEstrelas() {
    // Procura por contêineres de estrelas na página
    const conteineresEstrelas = document.querySelectorAll('.estrelas, .star-rating, .avaliar-estrelas');

    conteineresEstrelas.forEach(container => {
        const estrelas = container.querySelectorAll('.estrela, i, span');

        estrelas.forEach((estrela, index) => {
            estrela.style.cursor = 'pointer';

            // Evento de Clique
            estrela.addEventListener('click', () => {
                const nota = index + 1;
                container.dataset.rating = nota;
                pintarEstrelas(container, nota);
                
                // Salva a nota no localStorage para persistência visual
                if (container.id) {
                    localStorage.setItem(`avaliacao_${container.id}`, nota);
                }
            });

            // Efeito de passar o mouse (Hover)
            estrela.addEventListener('mouseenter', () => {
                pintarEstrelas(container, index + 1);
            });
        });

        // Quando o mouse sai, volta para a nota selecionada anteriormente
        container.addEventListener('mouseleave', () => {
            const notaSalva = container.dataset.rating || (container.id ? localStorage.getItem(`avaliacao_${container.id}`) : 0);
            pintarEstrelas(container, parseInt(notaSalva) || 0);
        });

        // Carrega avaliação salva se houver
        if (container.id) {
            const notaSalva = localStorage.getItem(`avaliacao_${container.id}`);
            if (notaSalva) {
                container.dataset.rating = notaSalva;
                pintarEstrelas(container, parseInt(notaSalva));
            }
        }
    });
}

function pintarEstrelas(container, quantidade) {
    const estrelas = container.querySelectorAll('.estrela, i, span');
    estrelas.forEach((estrela, index) => {
        if (index < quantidade) {
            estrela.classList.add('ativa', 'active', 'fas', 'preenchida');
            estrela.classList.remove('far');
            estrela.style.color = '#FFD700'; // Cor dourada brilhante
        } else {
            estrela.classList.remove('ativa', 'active', 'fas', 'preenchida');
            estrela.classList.add('far');
            estrela.style.color = '#CCC'; // Cor cinza apagado
        }
    });
}

// ==========================================
// FIX 3: GERENCIAMENTO DE MODAIS E EVENTOS
// ==========================================
function configurarEventosModais() {
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
        abrirCadastro.onclick = (e) => {
            e.preventDefault();
            if (modalLogin) modalLogin.style.display = "none";
            if (modalCadastro) modalCadastro.style.display = "flex";
        };
    }

    // Formulário de Login (evita reload da página)
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.onsubmit = (e) => {
            e.preventDefault();
            login();
        };
    }

    // Formulário de Cadastro (evita reload da página)
    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        formCadastro.onsubmit = (e) => {
            e.preventDefault();
            cadastrar();
        };
    }
}

// ==========================================
// LOGIN CORRIGIDO (FIRESTORE)
// ==========================================
async function login() {
    const campoLogin = document.getElementById("loginUsuario") || document.getElementById("emailLogin");
    const campoSenha = document.getElementById("senhaLogin");

    if (!campoLogin || !campoSenha) {
        exibirAlerta('error', 'Erro', 'Campos de login não encontrados no formulário.');
        return;
    }

    const valorLogin = campoLogin.value.trim().toLowerCase();
    const senhaDigitada = campoSenha.value;

    if (!valorLogin || !senhaDigitada) {
        exibirAlerta('warning', 'Atenção', 'Preencha o e-mail/usuário e a senha.');
        return;
    }

    if (!db) {
        exibirAlerta('error', 'Erro', 'Banco de dados inacessível.');
        return;
    }

    try {
        // Busca por e-mail no Firestore
        let snapshot = await db.collection("usuarios").where("email", "==", valorLogin).get();

        // Se não encontrar por e-mail, tenta pelo nome
        if (snapshot.empty) {
            snapshot = await db.collection("usuarios").where("nome", "==", campoLogin.value.trim()).get();
        }

        if (snapshot.empty) {
            exibirAlerta('error', 'Conta não encontrada', 'Verifique os dados digitados ou cadastre-se.');
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
            exibirAlerta('success', 'Bem-vindo(a)!', `Olá, ${usuarioEncontrado.nome}!`, 1200);

            setTimeout(() => {
                const modalLogin = document.getElementById("modalLogin");
                if (modalLogin) modalLogin.style.display = "none";
                mostrarUsuario();
            }, 1200);
        } else {
            exibirAlerta('error', 'Senha Incorreta', 'A senha digitada está errada.');
        }

    } catch (error) {
        console.error("Erro no Login:", error);
        exibirAlerta('error', 'Erro', 'Falha ao conectar ao servidor: ' + error.message);
    }
}

// ==========================================
// CADASTRO CORRIGIDO (FIRESTORE)
// ==========================================
async function cadastrar() {
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) {
        exibirAlerta('error', 'Erro', 'Campos do formulário de cadastro não encontrados.');
        return;
    }

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
            exibirAlerta('error', 'E-mail existente', 'Este e-mail já está cadastrado.');
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
        exibirAlerta('success', 'Cadastrado!', 'Sua conta foi criada com sucesso.', 1200);

        setTimeout(() => {
            const modalCadastro = document.getElementById("modalCadastro");
            if (modalCadastro) modalCadastro.style.display = "none";
            mostrarUsuario();
        }, 1200);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        exibirAlerta('error', 'Erro', 'Não foi possível salvar o cadastro.');
    }
}

// ==========================================
// RECUPERAÇÃO DE SENHA
// ==========================================
async function esqueceuSenha(event) {
    if (event) event.preventDefault();

    if (typeof Swal === 'undefined') {
        alert("Recurso indisponível.");
        return;
    }

    const { value: emailDigitado } = await Swal.fire({
        title: 'Recuperar Senha',
        text: 'Digite seu e-mail cadastrado:',
        input: 'email',
        inputPlaceholder: 'seu@email.com',
        showCancelButton: true,
        confirmButtonText: 'Buscar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d4af37'
    });

    if (emailDigitado && db) {
        try {
            const snapshot = await db.collection("usuarios")
                .where("email", "==", emailDigitado.trim().toLowerCase())
                .get();

            if (!snapshot.empty) {
                const usuario = snapshot.docs[0].data();
                Swal.fire({
                    icon: 'info',
                    title: 'Senha Localizada',
                    html: `Sua senha é: <strong>${usuario.senha}</strong>`,
                    confirmButtonColor: '#d4af37'
                });
            } else {
                exibirAlerta('error', 'Não Encontrado', 'E-mail não cadastrado no sistema.');
            }
        } catch (error) {
            exibirAlerta('error', 'Erro', 'Falha na busca.');
        }
    }
}

// ==========================================
// AUXILIARES DE INTERFACE
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

function sair() {
    localStorage.removeItem("usuarioLogado");
    const modalPerfil = document.getElementById("modalPerfil");
    if (modalPerfil) modalPerfil.style.display = "none";
    mostrarUsuario();
    window.location.reload();
}

function pesquisarConteudo() {
    const campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    const pesquisa = campo.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card, .card-jogo");

    cards.forEach(card => {
        const textoCard = card.innerText.toLowerCase();
        if (textoCard.includes(pesquisa)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

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
