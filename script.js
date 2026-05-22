//js/script.js
    let usuario = localStorage.getItem("usuario")
    document.getElementById("usuario-logado").innerHTML =
    "Olá, " + usuario


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
localStorage.setItem("usuario", nome)
