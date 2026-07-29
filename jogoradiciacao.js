/*radiciacao*/
let resposta = 25;
let pontos = 0;
let fase = 1;
criarQuadrado(5);

/* CRIAR QUADRADO */
function criarQuadrado(tamanho){
    const quadrado =document.getElementById("quadrado");quadrado.innerHTML = "";quadrado.style.gridTemplateColumns =`repeat(${tamanho},60px)`;
    for(let i = 0; i < tamanho * tamanho; i++){
        quadrado.innerHTML += `<div class="quad"></div>`;}
}

/* VERIFICAR */

function verificar(valor){
    if(valor == resposta){
        pontos += 10;
        alert("✅ Acertou!");
    }else{
        alert("❌ Errou!");
    }

    document.getElementById("pontos").innerHTML = pontos;
}

/* NOVA PERGUNTA */
function novaPergunta(){
    fase++;
    if(fase > 10){
        alert("🎉 Você terminou o jogo!");
        fase = 1;
        pontos = 0;
    }
    document.getElementById("fase").innerHTML = fase;
    let lado = Math.floor(Math.random() * 6) + 2;
    resposta = lado * lado;
    document.getElementById("textoPergunta").innerHTML =`O quadrado possui lado ${lado}.`;criarQuadrado(lado);gerarAlternativas();atualizarBarra();
}

/* ALTERNATIVAS */

function gerarAlternativas(){

    let alternativas = [resposta];

    while(alternativas.length < 4){

        let numero =
        Math.floor(Math.random() * 50) + 1;

        if(!alternativas.includes(numero)){

            alternativas.push(numero);
        }
    }

    alternativas.sort(() => Math.random() - 0.5);

    const botoes =
    document.querySelectorAll(".alternativas button");

    botoes.forEach((botao, index) => {

        botao.innerHTML = alternativas[index];

        botao.setAttribute(
            "onclick",
            `verificar(${alternativas[index]})`
        );
    });
}

/* PROGRESSO */

function atualizarBarra(){

    let porcentagem = fase * 10;

    document.getElementById("progresso")
    .style.width = porcentagem + "%";
}
