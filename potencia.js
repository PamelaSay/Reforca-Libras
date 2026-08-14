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
let resultadosDoTeste = [];

// CARREGAR PERGUNTA

const perguntas = [
    {
        topico: "Leitura da potência",

        pergunta: "Como lemos 2³?",

        respostas: [
            "Dois vezes três",
            "Dois elevado ao cubo",
            "Três ao quadrado"
        ],

        correta: 1
    },

    {
        topico: "Cálculo de potência",

        pergunta: "3² corresponde a:",

        respostas: [
            "3 + 3",
            "3 × 3",
            "2 × 3"
        ],

        correta: 1
    },

    {
        topico: "Cálculo de potência",

        pergunta: "Quanto vale 2⁴?",

        respostas: [
            "8",
            "12",
            "16"
        ],

        correta: 2
    },

    {
        topico: "Casos especiais",

        pergunta: "Quanto vale 5⁰?",

        respostas: [
            "0",
            "5",
            "1"
        ],

        correta: 2
    },

    {
        topico: "Produto de potências",

        pergunta: "2³ × 2² = ?",

        respostas: [
            "2⁵",
            "4⁵",
            "2⁶"
        ],

        correta: 0
    },

    {
        topico: "Potência de potência",

        pergunta: "(a²)³ = ?",

        respostas: [
            "a⁵",
            "a⁶",
            "a⁹"
        ],

        correta: 1
    }
];


function verificarResposta(indice) {
    const pergunta = perguntas[perguntaAtual];

    const acertou =
        indice === pergunta.correta;

    resultadosDoTeste.push({
        numeroQuestao: perguntaAtual + 1,
        topico: pergunta.topico,
        pergunta: pergunta.pergunta,
        respostaEscolhida:
            pergunta.respostas[indice],
        respostaCorreta:
            pergunta.respostas[pergunta.correta],
        acertou: acertou
    });

    if (acertou) {
        pontos += 10;

        document.getElementById(
            "feedback"
        ).textContent =
            "🎉 Resposta correta!";

    } else {
        vidas--;

        document.getElementById(
            "feedback"
        ).textContent =
            "❌ Resposta incorreta!";
    }

    atualizarStatus();

    if (vidas <= 0) {
        finalizarAvaliacao(false);
        return;
    }

    perguntaAtual++;

    setTimeout(function () {
        if (
            perguntaAtual >=
            perguntas.length
        ) {
            finalizarAvaliacao(true);
            return;
        }

        carregarPergunta();

        document.getElementById(
            "feedback"
        ).textContent = "";

    }, 1200);
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

function analisarDificuldades() {
    const desempenho = {};

    resultadosDoTeste.forEach(
        function (resultado) {
            const topico =
                resultado.topico;

            if (!desempenho[topico]) {
                desempenho[topico] = {
                    acertos: 0,
                    erros: 0,
                    total: 0
                };
            }

            desempenho[topico].total++;

            if (resultado.acertou) {
                desempenho[topico].acertos++;
            } else {
                desempenho[topico].erros++;
            }
        }
    );

    const dificuldades = [];

    Object.keys(desempenho).forEach(
        function (topico) {
            const dados =
                desempenho[topico];

            const percentual = Math.round(
                (
                    dados.acertos /
                    dados.total
                ) * 100
            );

            dados.percentual =
                percentual;

            if (percentual < 70) {
                dificuldades.push(topico);
            }
        }
    );

    return {
        desempenho: desempenho,
        dificuldades: dificuldades
    };
}
function salvarConclusaoDoTeste() {
    const CHAVE_CURSO =
        "progressoCursoPotenciacao";

    const etapa =
        Number(
            sessionStorage.getItem(
                "testeCursoAtual"
            )
        ) || 1;

    let progresso;

    try {
        progresso = JSON.parse(
            localStorage.getItem(
                CHAVE_CURSO
            )
        );
    } catch (erro) {
        progresso = null;
    }

    if (!progresso) {
        progresso = {
            etapaLiberada: 1,
            aulasAssistidas: [],
            concluidas: []
        };
    }

    if (
        !Array.isArray(
            progresso.aulasAssistidas
        )
    ) {
        progresso.aulasAssistidas = [];
    }

    if (
        !Array.isArray(
            progresso.concluidas
        )
    ) {
        progresso.concluidas = [];
    }

    if (
        !progresso.concluidas.includes(
            etapa
        )
    ) {
        progresso.concluidas.push(etapa);
    }

    progresso.etapaLiberada =
        Math.min(
            4,
            Math.max(
                progresso.etapaLiberada,
                etapa + 1
            )
        );

    localStorage.setItem(
        CHAVE_CURSO,
        JSON.stringify(progresso)
    );

    return etapa;
}
function finalizarAvaliacao(completou) {
    const analise =
        analisarDificuldades();

    const acertos =
        resultadosDoTeste.filter(
            function (resultado) {
                return resultado.acertou;
            }
        ).length;

    const percentual = Math.round(
        (
            acertos /
            perguntas.length
        ) * 100
    );

    const aprovado =
        completou && percentual >= 70;

    salvarResultadoDoAluno(
        percentual,
        analise
    );

    if (aprovado) {
        salvarConclusaoDoTeste();

        Swal.fire({
            icon: "success",
            title: "Teste concluído!",
            html:
                montarRelatorio(
                    percentual,
                    analise
                ),
            confirmButtonText:
                "Ir para a próxima aula",
            confirmButtonColor:
                "#1d3557"
        }).then(function () {
            window.location.href =
                "potenciacao.html";
        });

    } else {
        Swal.fire({
            icon: "warning",
            title: "Vamos revisar?",
            html:
                montarRelatorio(
                    percentual,
                    analise
                ),
            showCancelButton: true,
            confirmButtonText:
                "Tentar novamente",
            cancelButtonText:
                "Voltar ao curso",
            confirmButtonColor:
                "#1d3557"
        }).then(function (resultado) {
            if (resultado.isConfirmed) {
                window.location.reload();
            } else {
                window.location.href =
                    "potenciacao.html";
            }
        });
    }
}
function montarRelatorio(
    percentual,
    analise
) {
    let html =
        "<p><strong>Desempenho: " +
        percentual +
        "%</strong></p>";

    if (
        analise.dificuldades.length === 0
    ) {
        html +=
            "<p>Você demonstrou bom domínio dos conteúdos avaliados.</p>";
    } else {
        html +=
            "<p>Recomendamos revisar:</p><ul>";

        analise.dificuldades.forEach(
            function (topico) {
                html +=
                    "<li>" +
                    topico +
                    "</li>";
            }
        );

        html += "</ul>";
    }

    return html;
}
function salvarResultadoDoAluno(
    percentual,
    analise
) {
    const usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );

    const historico = JSON.parse(
        localStorage.getItem(
            "resultadosPotenciacao"
        )
    ) || [];

    historico.push({
        usuarioId:
            usuario?.uid ||
            usuario?.id ||
            null,

        nome:
            usuario?.nome ||
            usuario?.displayName ||
            "Aluno não identificado",

        email:
            usuario?.email ||
            "",

        etapa:
            Number(
                sessionStorage.getItem(
                    "testeCursoAtual"
                )
            ) || 1,

        pontuacao: pontos,
        percentual: percentual,

        respostas:
            resultadosDoTeste,

        desempenhoPorTopico:
            analise.desempenho,

        dificuldades:
            analise.dificuldades,

        realizadoEm:
            new Date().toISOString()
    });

    localStorage.setItem(
        "resultadosPotenciacao",
        JSON.stringify(historico)
    );
}