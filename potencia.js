// potencia.js

const perguntas = [

{
    pergunta:"Como lemos 2³ ?",

    respostas:[
        "Dois vezes três",
        "Dois elevado ao cubo",
        "Três ao quadrado"
    ],

    correta:1
},

{
    pergunta:"3² corresponde a:",

    respostas:[
        "3 + 3",
        "3 × 3",
        "2 × 3"
    ],

    correta:1
},

{
    pergunta:"Quanto vale 2⁴ ?",

    respostas:[
        "8",
        "12",
        "16"
    ],

    correta:2
},

{
    pergunta:"Quanto vale 5⁰ ?",

    respostas:[
        "0",
        "5",
        "1"
    ],

    correta:2
},

{
    pergunta:"2³ × 2² = ?",

    respostas:[
        "2⁵",
        "4⁵",
        "2⁶"
    ],

    correta:0
},

{
    pergunta:"(a²)³ = ?",

    respostas:[
        "a⁵",
        "a⁶",
        "a⁹"
    ],

    correta:1
}

]

let perguntaAtual = 0

let pontos = 0

let vidas = 3

function carregarPergunta(){

    if(perguntaAtual >= perguntas.length){

        finalizarJogo()

        return
    }

    document.getElementById("fase").innerHTML =
    perguntaAtual + 1

    let pergunta =
    perguntas[perguntaAtual]

    document.getElementById("pergunta").innerHTML =
    pergunta.pergunta

    let respostasHTML = ""

    pergunta.respostas.forEach(function(resposta,index){

        respostasHTML += `

        <button onclick="verificarResposta(${index})">

            ${resposta}

        </button>

        `
    })

    document.getElementById("respostas").innerHTML =
    respostasHTML
}

function verificarResposta(indice){

    let pergunta =
    perguntas[perguntaAtual]

    if(indice == pergunta.correta){

        pontos += 10

        document.getElementById("feedback").innerHTML =
        "🎉 Resposta correta!"

    }else{

        vidas--

        document.getElementById("feedback").innerHTML =
        "❌ Resposta incorreta!"
    }

    atualizarStatus()

    if(vidas <= 0){

        fimDeJogo()

        return
    }

    perguntaAtual++

    setTimeout(function(){

        carregarPergunta()

        document.getElementById("feedback").innerHTML = ""

    },1500)
}

function atualizarStatus(){

    document.getElementById("pontos").innerHTML =
    pontos

    document.getElementById("vidas").innerHTML =
    vidas
}

function finalizarJogo(){

    document.querySelector(".quiz-box").innerHTML = `

    <h2>

        🏆 Missão concluída!

    </h2>

    <br>

    <h3>

        Pontuação final: ${pontos}

    </h3>

    <br>

    <button onclick="reiniciarJogo()">

        🔄 Jogar Novamente

    </button>

    `
}

function fimDeJogo(){

    document.querySelector(".quiz-box").innerHTML = `

    <h2>

        💀 Game Over

    </h2>

    <br>

    <h3>

        Você perdeu todas as vidas!

    </h3>

    <br>

    <button onclick="reiniciarJogo()">

        🔄 Tentar Novamente

    </button>

    `
}

function reiniciarJogo(){

    perguntaAtual = 0

    pontos = 0

    vidas = 3

    location.reload()
}

carregarPergunta()
