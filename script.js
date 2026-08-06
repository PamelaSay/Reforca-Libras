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

