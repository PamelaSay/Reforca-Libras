//js/script.js
let usuario = localStorage.getItem("usuario")
        document.getElementById("usuario-logado").innerHTML =
        "Olá, " + usuario

function salvarComentario(){

    let comentario =
    document.getElementById("comentario").value

    localStorage.setItem("comentario", comentario)

    alert("Comentário enviado!")
}

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

