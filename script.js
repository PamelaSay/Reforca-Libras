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

    let input =
    document.getElementById("campo-pesquisa")
    .value.toLowerCase()

    let cards =
    document.querySelectorAll(".card")

    cards.forEach(function(card){

        let texto =
        card.innerText.toLowerCase()

        if(texto.includes(input)){

            card.style.display = "block"

        }else{

            card.style.display = "none"
        }

    })
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

function abrirJogo( ){

    if(tipo === 'jogo_potencia'){
        window.location.href = "jogo_potencia.html"}

    if(tipo === 'radiciacao'){
        alert('Abrindo jogo de Radiciação')
    }

    if(tipo === 'cartesiano'){
        alert('Abrindo jogo Plano Cartesiano')
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

