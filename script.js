<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCA5nHe1MRdnYR70flitnIjI75IOkh0ji8",
    authDomain: "reforca-app-25554.firebaseapp.com",
    projectId: "reforca-app-25554",
    storageBucket: "reforca-app-25554.firebasestorage.app",
    messagingSenderId: "469342727365",
    appId: "1:469342727365:web:cd2def6eafd29e615114ac",
    measurementId: "G-0YVN46JS8W"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>







console.log("script carregado")
// =========================
// USUÁRIO LOGADO
// =========================
function usuariologado(){
let usuario = localStorage.getItem("usuario")

if(document.getElementById("Login realizado!")){

    document.getElementById("Login realizado!").innerHTML =
    "Olá, " + usuario
}}
console.log("script carregado");

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

// Evento no botão do Header (se logado abre perfil, se não abre login)
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

// Trocar do Login para o Cadastro
if (abrirCadastro) {
    abrirCadastro.onclick = () => {
        if (modalLogin) modalLogin.style.display = "none";
        if (modalCadastro) modalCadastro.style.display = "flex";
    };
}

// ==========================================
// FUNÇÃO DE CADASTRO (Com Login Automático + Redirecionamento)
// ==========================================
function cadastrar() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    // Grava o usuário na coleção "usuarios"
    db.collection("usuarios").add({
        nome: nome,
        email: email,
        senha: senha,
        nivel: "Iniciante",
        pontos: 0,
        dataCriacao: new Date()
    })
    .then(() => {
        alert("Cadastro realizado com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao salvar no Firebase: ", error);
        alert("Erro ao cadastrar. Verifique o console.");
    });
}

    // Salva o cadastro e já salva como usuário LOGADO
    localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Cadastro realizado! Entrando...',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        // REDIRECIONA PARA A PÁGINA INICIAL
        window.location.href = "index.html";
    });
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
        Swal.fire({
            icon: 'info',
            title: 'Conta não encontrada',
            text: 'Você ainda não possui cadastro.',
            confirmColor: '#3085d6'
        });
        return;
    }

    const loginCorreto = (loginDigitado === usuario.email || loginDigitado === usuario.nome);
    const senhaCorreta = (senhaDigitada === usuario.senha);

    if (loginCorreto && senhaCorreta) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        Swal.fire({
            icon: 'success',
            title: 'Bem-vindo(a)!',
            text: `Olá, ${usuario.nome}!`,
            timer: 2000,
            showConfirmButton: false
        });

        if (modalLogin) modalLogin.style.display = "none";
        mostrarUsuario();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'E-mail/Usuário ou senha incorretos!',
            confirmColor: '#d33'
        });
    }
}

// ==========================================
// ALTERNAR VISIBILIDADE DA SENHA (OLHO)
// ==========================================
function alternarSenha(idCampo, elementoIcone) {
    const campoSenha = document.getElementById(idCampo);

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        elementoIcone.innerText = "🙈"; // Ícone para ocultar
    } else {
        campoSenha.type = "password";
        elementoIcone.innerText = "👁️"; // Ícone para ver
    }
}

// ==========================================
// FUNÇÃO ESQUECEU SUA SENHA
// ==========================================
function esqueceuSenha(event) {
    if (event) event.preventDefault();

    Swal.fire({
        title: 'Recuperação de Senha',
        text: 'Digite o e-mail cadastrado na sua conta:',
        input: 'email',
        inputPlaceholder: 'seu.email@exemplo.com',
        showCancelButton: true,
        confirmButtonText: 'Verificar',
        cancelButtonText: 'Cancelar',
        confirmColor: '#3085d6',
        cancelColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            const emailDigitado = result.value.trim();
            const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

            if (usuario && usuario.email.toLowerCase() === emailDigitado.toLowerCase()) {
                Swal.fire({
                    icon: 'success',
                    title: 'Senha Encontrada!',
                    html: `Sua senha cadastrada é: <strong>${usuario.senha}</strong>`,
                    confirmColor: '#3085d6'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Não encontrado',
                    text: 'Nenhuma conta cadastrada foi encontrada com este e-mail.',
                    confirmColor: '#d33'
                });
            }
        }
    });
}
// ==========================================
// EXIBIR DADOS DO USUÁRIO LOGADO
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
// SAIR E EXCLUIR CONTA (CORRIGIDO)
// ==========================================
function sair() {
    // 1. Remove a sessão logada
    localStorage.removeItem("usuarioLogado");

    // 2. Esconde o modal de perfil
    if (modalPerfil) modalPerfil.style.display = "none";

    // 3. Reseta explicitamente o texto do botão no menu
    if (btnLogin) btnLogin.innerHTML = "👤 Entrar";

    // 4. Recarrega a página para limpar qualquer estado residual
    window.location.reload();
}

function excluirConta() {
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
            // Remove o cadastro e o login
            localStorage.removeItem("usuarioCadastrado");
            localStorage.removeItem("usuarioLogado");

            if (modalPerfil) modalPerfil.style.display = "none";
            
            // Reseta o botão do menu
            if (btnLogin) btnLogin.innerHTML = "👤 Entrar";

            Swal.fire({
                icon: 'success',
                title: 'Excluído!',
                text: 'Sua conta foi removida.',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Recarrega a página para atualizar a interface
                window.location.reload();
            });
        }
    });
}

// ==========================================
// MOSTRAR NOME NO MENU
// ==========================================

function mostrarUsuario() {
    let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario && btnLogin) {
        btnLogin.innerHTML = "👤 " + usuario.nome;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();
});

// =========================
// Pesquisar conteúdo
// =========================
function pesquisarConteudo(){

let pesquisa =
document.getElementById("campoPesquisa")
.value
.toLowerCase();


let cards =
document.querySelectorAll(".card");


cards.forEach(card=>{


let nome =
card.dataset.nome;


if(nome.includes(pesquisa)){


card.style.display="block";


}
else{


card.style.display="none";


}


});


}

// Exemplo de como deve ficar a função do botão da Disciplina / Subnível
const btnDisciplina = document.getElementById("btnDisciplina"); // ou o seu seletor

if (btnDisciplina) {
    btnDisciplina.addEventListener("click", function(e) {
        // 1. Impede que a página dê "jump" ou recarregue se for um link <a>
        e.preventDefault(); 

        // 2. IMPEDIMENTO CHAVE: Evita que o clique suba para a página e feche o menu na hora!
        e.stopPropagation(); 

        // 3. Sua lógica para abrir o subnível da matemática
        const subnivelMatematica = document.getElementById("subnivelMatematica");
        if (subnivelMatematica) {
            subnivelMatematica.classList.toggle("ativo"); // ou .style.display = 'block'
        }
    });
}


// =========================
// MENU RESPONSIVO
// =========================

function menuResponsivo(){

    const nav = document.getElementById("menu-links")

    nav.classList.toggle("ativo")
}

// =========================
// COMENTÁRIOS
// =========================

function salvarComentario(){

    let comentario =
    document.getElementById("comentario").value

    if(comentario == ""){

        alert("Digite um comentário!")

        return
    }

    let comentarios = JSON.parse(
        localStorage.getItem("comentarios")
    ) || []

    comentarios.push(comentario)

    localStorage.setItem(
        "comentarios",
        JSON.stringify(comentarios)
    )

    mostrarComentarios()

    document.getElementById("comentario").value = ""
}

function mostrarComentarios(){

    let comentarios = JSON.parse(
        localStorage.getItem("comentarios")
    ) || []

    let lista =
    document.getElementById("lista-comentarios")

    if(!lista){
        return
    }

    lista.innerHTML = ""

    comentarios.forEach(function(item){

        lista.innerHTML += `

        <div class="comentario-item">

            💬 ${item}

        </div>

        `
    })
}

mostrarComentarios()

// =========================
// ABRIR JOGOS
// =========================

function abrirJogo(tipo){

    if(tipo === 'potencia' ){

        window.location.href =
          "jogo_potencia.html"
        }

    if(tipo === 'radiciacao' ){

        window.location.href =
          "jogoradiciacao.html"
    }
if(tipo === 'planocartesiano' ){

        window.location.href=
            "planocartesiano.html"
    }
    
}

// =========================
// PONTUAÇÃO
// =========================

localStorage.setItem("pontos", 10)

let pontos =
localStorage.getItem("pontos")

if(document.getElementById("pontuacao")){

    document.getElementById("pontuacao").innerHTML =
    pontos
}

// =========================
// VOLTAR PÁGINA
// =========================

function voltarPagina(){

    history.back()
}
function voltarPagina(){

    history.back()
}

