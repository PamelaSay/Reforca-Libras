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
    var auth = firebase.auth();
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
// FUNÇÃO DE CADASTRO (Auth + Firestore + LocalStorage)
// ==========================================
function cadastrar() {
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
        mostrarAlerta('warning', 'Atenção', 'Preencha todos os campos do cadastro!');
        return;
    }

    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert("Erro na conexão com o Firebase.");
        return;
    }

    // 1. Cria a conta no Firebase Authentication
    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;

            // Atualiza o perfil com o nome digitado
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

            // 2. Salva informações adicionais no Firestore
            return db.collection("usuarios").doc(user.uid).set(novoUsuario).then(() => novoUsuario);
        })
        .then((dadosUsuario) => {
            // 3. Salva a sessão localmente
            localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

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
            console.error("Erro ao cadastrar:", error);
            let mensagemErro = "Erro ao realizar cadastro.";
            if (error.code === 'auth/email-already-in-use') {
                mensagemErro = "Este e-mail já está em uso.";
            } else if (error.code === 'auth/weak-password') {
                mensagemErro = "A senha deve ter pelo menos 6 caracteres.";
            }
            mostrarAlerta('error', 'Erro no Cadastro', mensagemErro);
        });
}

// ==========================================
// FUNÇÃO DE LOGIN UNIFICADA (Firebase Auth)
// ==========================================
function executarLogin(email, senha) {
    if (!email || !senha) {
        mostrarAlerta('warning', 'Atenção', 'Por favor, preencha todos os campos.');
        return;
    }

    if (typeof firebase !== 'undefined' && firebase.auth) {
        auth.signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                const user = userCredential.user;

                let nomeFormatado = user.displayName;
                if (!nomeFormatado && user.email) {
                    nomeFormatado = user.email.split("@")[0];
                    nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);
                }

                const dadosUsuario = {
                    uid: user.uid,
                    email: user.email,
                    nome: nomeFormatado || "Aluno",
                    pontos: 0
                };

                localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Bem-vindo(a)!',
                        text: `Olá, ${dadosUsuario.nome}!`,
                        timer: 1800,
                        showConfirmButton: false
                    }).then(() => {
                        if (modalLogin) modalLogin.style.display = "none";
                        mostrarUsuario();
                    });
                } else {
                    alert(`Bem-vindo(a), ${dadosUsuario.nome}!`);
                    if (modalLogin) modalLogin.style.display = "none";
                    mostrarUsuario();
                }
            })
            .catch((error) => {
                console.error("Erro no login:", error);
                mostrarAlerta('error', 'Erro', 'E-mail ou senha incorretos!');
            });
    } else {
        alert("Serviço de autenticação indisponível.");
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
// FUNÇÃO ESQUECEU SUA SENHA (Recuperação Oficial Firebase)
// ==========================================
function esqueceuSenha(event) {
    if (event) event.preventDefault();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Recuperação de Senha',
            text: 'Digite seu e-mail para receber o link de redefinição:',
            input: 'email',
            inputPlaceholder: 'seu.email@exemplo.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar Link',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const emailDigitado = result.value.trim();

                auth.sendPasswordResetEmail(emailDigitado)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'E-mail Enviado!',
                            text: 'Verifique sua caixa de entrada para redefinir a senha.'
                        });
                    })
                    .catch((error) => {
                        console.error("Erro ao redefinir senha:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Não foi possível enviar o e-mail de recuperação.'
                        });
                    });
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
    if (auth) auth.signOut();
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
                const user = auth.currentUser;
                if (user) {
                    user.delete().then(() => {
                        localStorage.removeItem("usuarioLogado");
                        window.location.reload();
                    }).catch((error) => {
                        console.error("Erro ao excluir conta:", error);
                        alert("Para excluir a conta, faça login novamente e tente em seguida.");
                    });
                }
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
// NAVEGAÇÃO E UTILITÁRIOS
// ==========================================
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

// ==========================================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Atualiza interface do usuário
    mostrarUsuario();

    // Limpa o campo de pesquisa
    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) campoPesquisa.value = "";

    // Evento do Formulário de Login
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("emailLogin") || document.getElementById("loginUsuario");
            const senhaInput = document.getElementById("senhaLogin");

            if (emailInput && senhaInput) {
                executarLogin(emailInput.value.trim(), senhaInput.value);
            }
        });
    }
});

// Limpa autopreenchimento do navegador no login
window.addEventListener("load", () => {
    setTimeout(() => {
        const campoEmail = document.getElementById("emailLogin") || document.getElementById("loginUsuario");
        const campoSenha = document.getElementById("senhaLogin");

        if (campoEmail) campoEmail.value = "";
        if (campoSenha) campoSenha.value = "";
    }, 150);
});
