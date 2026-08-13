// potencia.js

const perguntas = [
    {
        pergunta: "Como lemos 2³?",
        respostas: [
            "Dois vezes três",
            "Dois elevado ao cubo",
            "Três ao quadrado"
        ],
        correta: 1
    },

    {
        pergunta: "3² corresponde a:",
        respostas: [
            "3 + 3",
            "3 × 3",
            "2 × 3"
        ],
        correta: 1
    },

    {
        pergunta: "Quanto vale 2⁴?",
        respostas: [
            "8",
            "12",
            "16"
        ],
        correta: 2
    },

    {
        pergunta: "Quanto vale 5⁰?",
        respostas: [
            "0",
            "5",
            "1"
        ],
        correta: 2
    },

    {
        pergunta: "2³ × 2² = ?",
        respostas: [
            "2⁵",
            "4⁵",
            "2⁶"
        ],
        correta: 0
    },

    {
        pergunta: "(a²)³ = ?",
        respostas: [
            "a⁵",
            "a⁶",
            "a⁹"
        ],
        correta: 1
    }
];

let perguntaAtual = 0;
let pontos = 0;
let vidas = 3;


// CARREGAR PERGUNTA

function carregarPergunta() {
    if (perguntaAtual >= perguntas.length) {
        finalizarJogo();
        return;
    }

    const elementoFase =
        document.getElementById("fase");

    const elementoPergunta =
        document.getElementById("pergunta");

    const elementoRespostas =
        document.getElementById("respostas");

    if (
        !elementoFase ||
        !elementoPergunta ||
        !elementoRespostas
    ) {
        console.error(
            "Os elementos fase, pergunta ou respostas não foram encontrados."
        );

        return;
    }

    elementoFase.innerHTML = perguntaAtual + 1;

    const pergunta = perguntas[perguntaAtual];

    elementoPergunta.innerHTML = pergunta.pergunta;

    let respostasHTML = "";

    pergunta.respostas.forEach(
        function (resposta, indice) {
            respostasHTML += `
                <button
                    type="button"
                    onclick="verificarResposta(${indice})"
                >
                    ${resposta}
                </button>
            `;
        }
    );

    elementoRespostas.innerHTML = respostasHTML;
}


// VERIFICAR RESPOSTA

function verificarResposta(indice) {
    const pergunta = perguntas[perguntaAtual];

    if (indice === pergunta.correta) {
        pontos += 10;

        document.getElementById("feedback").innerHTML =
            "🎉 Resposta correta!";
    } else {
        vidas--;

        document.getElementById("feedback").innerHTML =
            "❌ Resposta incorreta!";
    }

    atualizarStatus();

    if (vidas <= 0) {
        fimDeJogo();
        return;
    }

    perguntaAtual++;

    setTimeout(function () {
        carregarPergunta();

        const feedback =
            document.getElementById("feedback");

        if (feedback) {
            feedback.innerHTML = "";
        }
    }, 1500);
}


// ATUALIZAR STATUS

function atualizarStatus() {
    const elementoPontos =
        document.getElementById("pontos");

    const elementoVidas =
        document.getElementById("vidas");

    if (elementoPontos) {
        elementoPontos.innerHTML = pontos;
    }

    if (elementoVidas) {
        elementoVidas.innerHTML = vidas;
    }
}


// FINALIZAR JOGO

function finalizarJogo() {
    const quiz =
        document.querySelector(".quiz-box");

    if (!quiz) {
        return;
    }

    quiz.innerHTML = `
        <h2>🏆 Missão concluída!</h2>

        <br>

        <h3>Pontuação final: ${pontos}</h3>

        <br>

        <button
            type="button"
            onclick="reiniciarJogo()"
        >
            🔄 Jogar novamente
        </button>
    `;
}


// FIM DE JOGO

function fimDeJogo() {
    const quiz =
        document.querySelector(".quiz-box");

    if (!quiz) {
        return;
    }

    quiz.innerHTML = `
        <h2>💀 Game Over</h2>

        <br>

        <h3>Você perdeu todas as vidas!</h3>

        <br>

        <button
            type="button"
            onclick="reiniciarJogo()"
        >
            🔄 Tentar novamente
        </button>
    `;
}


// REINICIAR

function reiniciarJogo() {
    perguntaAtual = 0;
    pontos = 0;
    vidas = 3;

    window.location.reload();
}


// VOLTAR

function voltarPagina() {
    window.history.back();
}


// INICIAR O JOGO

document.addEventListener(
    "DOMContentLoaded",
    function () {
        carregarPergunta();
        atualizarStatus();
    }
);


function voltarPagina() {
    window.history.back();
}   

