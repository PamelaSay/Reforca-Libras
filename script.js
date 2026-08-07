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
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
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

// Evento do botão do Header (Login / Perfil)
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

// Trocar de Login para Cadastro
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
    // Busca pelos IDs corretos do seu HTML
    const nomeInput = document.getElementById('nomeCadastro');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');

    if (!nomeInput || !emailInput || !senhaInput) {
        alert("Erro: Campos de cadastro não encontrados!");
        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!nome || !email || !senha) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Preencha todos os campos do cadastro!'
            });
        } else {
            alert("Preencha todos os campos!");
        }
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        nivel: "Iniciante",
        pontos: 0
    };

    // Salva no banco de dados do Firebase
    if (typeof db !== 'undefined') {
        db.collection("usuarios").add({
            ...novoUsuario,
            dataCriacao: new Date()
        })
        .then((docRef) => {
            console.log("Usuário cadastrado com ID:", docRef.id);

            // Armazena sessão localmente
            localStorage.setItem("usuarioCadastrado", JSON.stringify(novoUsuario));
            localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Cadastro realizado com sucesso!',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            } else {
                alert("Cadastro realizado com sucesso!");
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("Erro ao salvar no Firebase:", error);
            alert("Erro ao cadastrar: " + error.message);
        });
    } else {
        alert("Erro na conexão com o banco de dados Firebase.");
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
                text: 'Você ainda não possui cadastro.'
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
                timer: 1800,
                showConfirmButton: false
            }).then(() => {
                if (modalLogin) modalLogin.style.display = "none";
                mostrarUsuario();
            });
        } else {
            if (modalLogin) modalLogin.style.display = "none";
            mostrarUsuario();
        }
    } else {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'E-mail/Usuário ou senha incorretos!'
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
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const emailDigitado = result.value.trim();
                const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

                if (usuario && usuario.email.toLowerCase() === emailDigitado.toLowerCase()) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Senha Encontrada!',
                        html: `Sua senha cadastrada é: <strong>${usuario.senha}</strong>`
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Não encontrado',
                        text: 'Nenhuma conta encontrada com este e-mail.'
                    });
                }
            }
        });
    }
}

// ==========================================
// MOSTRAR USUÁRIO LOGADO E PERFIL
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
    let campo = document.getElementById("campoPesquisa");
    if (!campo) return;

    let pesquisa = campo.value.toLowerCase();
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
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Atualiza o nome do usuário na tela se ele já estiver logado
    if (typeof mostrarUsuario === "function") {
        mostrarUsuario();
    }

    // 2. Garante que o campo de pesquisa comece limpo
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.value = "";
    }

    // 3. Captura o envio do formulário de Login
    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita que a página recarregue ao clicar em Entrar

            const emailInput = document.getElementById("emailLogin");
            const senhaInput = document.getElementById("senhaLogin");

            if (!emailInput || !senhaInput) return;

            const email = emailInput.value.trim();
            const senha = senhaInput.value;

            if (!email || !senha) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            // 4. Autenticação via Firebase
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signInWithEmailAndPassword(email, senha)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        
                        // Formata e salva o nome do usuário no localStorage
                        let nomeFormatado = user.displayName;
                        if (!nomeFormatado && user.email) {
                            nomeFormatado = user.email.split("@")[0];
                            nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
                        }

                        const dadosUsuario = {
                            email: user.email,
                            nome: nomeFormatado || "Aluno"
                        };
                        
                        localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

                        alert("Login realizado com sucesso!");
                        
                        // Atualiza a tela com o nome
                        if (typeof mostrarUsuario === "function") {
                            mostrarUsuario();
                        }
                    })
                    .catch((error) => {
                        console.error("Erro no login:", error);
                        alert("E-mail ou senha incorretos.");
                    });
            } else {
                alert("Serviço de autenticação não encontrado.");
            }
        });
    }
});

// Limpa o preenchimento automático do Chrome assim que a página termina de carregar
window.addEventListener("load", () => {
    setTimeout(() => {
        const campoEmail = document.getElementById("emailLogin");
        const campoSenha = document.getElementById("senhaLogin");

        if (campoEmail) campoEmail.value = "";
        if (campoSenha) campoSenha.value = "";
    }, 150);
});
