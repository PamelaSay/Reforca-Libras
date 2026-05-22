//js/script.js
let usuario = localStorage.getItem("usuario")
        document.getElementById("usuario-logado").innerHTML =
        "Olá, " + usuario

function menuresponsivo(){
$('.toggle-menu').click (function(){
  $(this).toggleClass('active');
  $('#menu').toggleClass('open');
})};

function salvarComentario(){

    let comentario =
    document.getElementById("comentario").value

    if(comentario == ""){

        alert("Digite um comentário!")

        return
    }

    let comentarios = JSON.parse(
    localStorage.getItem("comentarios")) || []

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
    localStorage.getItem("comentarios")) || []
    let lista =
    document.getElementById("lista-comentarios")
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

function abrirjogo(tipo){
  if(tipo =='potencia1'){
    alert('Abrindo jogo de Potenciação');
  }
  if(tipo === 'radiciacao'){
    alert('Abrindo jogo de Radiciação');
  }
  if(tipo === ' cartesiano'){
    alert('Abrindo jogo Plano Cartesiano')
  }
}

let pontos = 10
localStorage.setItem("pontos", pontos)

let pontos = localStorage.getItem("pontos")
document.getElementById("pontuacao")
.innerHTML = pontos

function voltarPagina(){

    history.back()
}

