//js/script.js
localStorage.setItem("usuario", nome)
function entrar(){

    let nome = document.getElementById("nome").value

    localStorage.setItem("usuario", nome)

    window.location.href = "index.html"
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
localStorage.setItem("usuario", nome)
