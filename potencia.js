// ==========================================
// JOGO — INTRODUÇÃO À POTENCIAÇÃO
// ==========================================

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
        topico: "Significado da potência",

        pergunta: "A potência 3² corresponde a:",

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

        pergunta: "2³ × 2² é igual a:",

        respostas: [
            "2⁵",
            "4⁵",
            "2⁶"
        ],

        correta: 0
    },

    {
        topico: "Potência de potência",

        pergunta: "(a²)³ é igual a:",

        respostas: [
            "a⁵",
            "a⁶",
            "a⁹"
        ],

        correta: 1
    }
];


// ==========================================
// VARIÁVEIS DO JOGO
// ==========================================

let perguntaAtual = 0;
let pontos = 0;
let vidas = 3;
let respostaBloqueada = false;
let resultadosDoTeste = [];


// ==========================================
// CARREGAR PERGUNTA
// ==========================================

function carregarPergunta() {
    const elementoPergunta =
        document.getElementById("pergunta");

    const elementoRespostas =
        document.getElementById("respostas");

    const elementoFase =
        document.getElementById("fase");

    const elementoFeedback =
        document.getElementById("feedback");

    if (
        !elementoPergunta ||
        !elementoRespostas
    ) {
        console.error(
            "Os elementos #pergunta ou " +
            "#respostas não foram encontrados."
        );

        return;
    }

    if (perguntaAtual >= perguntas.length) {
        finalizarAvaliacao();
        return;
    }

    respostaBloqueada = false;

    if (elementoFeedback) {
        elementoFeedback.textContent = "";
    }

    if (elementoFase) {
        elementoFase.textContent =
            perguntaAtual + 1;
    }

    const pergunta =
        perguntas[perguntaAtual];

    elementoPergunta.textContent =
        pergunta.pergunta;

    elementoRespostas.innerHTML = "";

    pergunta.respostas.forEach(
        function (resposta, indice) {
            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.textContent = resposta;

            botao.addEventListener(
                "click",
                function () {
                    verificarResposta(indice);
                }
            );

            elementoRespostas.appendChild(botao);
        }
    );
}


// ==========================================
// VERIFICAR RESPOSTA
// ==========================================

function verificarResposta(indice) {
    if (respostaBloqueada) {
        return;
    }

    respostaBloqueada = true;

    const pergunta =
        perguntas[perguntaAtual];

    const acertou =
        indice === pergunta.correta;

    resultadosDoTeste.push({
        numeroQuestao:
            perguntaAtual + 1,

        topico:
            pergunta.topico,

        pergunta:
            pergunta.pergunta,

        respostaEscolhida:
            pergunta.respostas[indice],

        respostaCorreta:
            pergunta.respostas[
                pergunta.correta
            ],

        acertou:
            acertou
    });

    const feedback =
        document.getElementById("feedback");

    if (acertou) {
        pontos += 10;

        if (feedback) {
            feedback.textContent =
                "🎉 Resposta correta!";
        }

    } else {
        vidas--;

        if (feedback) {
            feedback.textContent =
                "❌ Resposta incorreta!";
        }
    }

    atualizarStatus();

    perguntaAtual++;

    setTimeout(
        function () {
            if (
                perguntaAtual >=
                perguntas.length
            ) {
                finalizarAvaliacao();
                return;
            }

            carregarPergunta();
        },
        1200
    );
}


// ==========================================
// ATUALIZAR PONTOS E VIDAS
// ==========================================

function atualizarStatus() {
    const elementoPontos =
        document.getElementById("pontos");

    const elementoVidas =
        document.getElementById("vidas");

    if (elementoPontos) {
        elementoPontos.textContent =
            pontos;
    }

    if (elementoVidas) {
        elementoVidas.textContent =
            vidas;
    }
}


// ==========================================
// ANALISAR RESULTADOS
// ==========================================

function analisarResultados() {
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

            dados.percentual = Math.round(
                (
                    dados.acertos /
                    dados.total
                ) * 100
            );

            if (dados.percentual < 70) {
                dificuldades.push(topico);
            }
        }
    );

    return {
        desempenho: desempenho,
        dificuldades: dificuldades
    };
}


// ==========================================
// SALVAR RESULTADO PARA O RELATÓRIO
// ==========================================

function salvarResultadoDoAluno(
    percentual,
    analise
) {
    let usuario = null;
    let historico = [];

    try {
        usuario = JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

        historico = JSON.parse(
            localStorage.getItem(
                chaveLocalDoUsuario("resultadosPotenciacao")
            )
        ) || [];

    } catch (erro) {
        usuario = null;
        historico = [];
    }

    const etapa =
        Number(
            sessionStorage.getItem(
                "testeCursoAtual"
            )
        ) || 1;

    historico.push({
        usuarioId:
            usuario?.uid ||
            usuario?.id ||
            null,

        nome:
            usuario?.nome ||
            usuario?.displayName ||
            "Aluno",

        email:
            usuario?.email ||
            "",

        etapa:
            etapa,

        pontuacao:
            pontos,

        percentual:
            percentual,

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
        chaveLocalDoUsuario("resultadosPotenciacao"),
        JSON.stringify(historico)
    );

    salvarResultadoPotenciacaoNoFirebase(
        historico[historico.length - 1]
    );
}

function salvarResultadoPotenciacaoNoFirebase(resultado) {
    if (
        typeof auth === "undefined" ||
        typeof db === "undefined" ||
        !auth ||
        !db ||
        !auth.currentUser
    ) {
        return;
    }

    db.collection("usuarios")
        .doc(auth.currentUser.uid)
        .collection("resultados")
        .add({
            tematica: "Potenciação",
            etapa: resultado.etapa,
            pontuacao: resultado.pontuacao,
            percentual: resultado.percentual,
            respostas: resultado.respostas,
            dificuldades: resultado.dificuldades,
            realizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(function (erro) {
            console.error("Erro ao salvar resultado da Potenciação:", erro);
        });
}


// ==========================================
// LIBERAR PRÓXIMA AULA
// ==========================================

function salvarConclusaoDoTeste() {
    const CHAVE_CURSO =
        chaveLocalDoUsuario("progressoCursoPotenciacao");

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

    progresso.concluidas.sort(
        function (a, b) {
            return a - b;
        }
    );

    progresso.etapaLiberada =
        Math.min(
            4,
            Math.max(
                Number(
                    progresso.etapaLiberada
                ) || 1,

                etapa + 1
            )
        );

    localStorage.setItem(
        CHAVE_CURSO,
        JSON.stringify(progresso)
    );
}


// ==========================================
// FINALIZAR AVALIAÇÃO
// ==========================================

function finalizarAvaliacao() {
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
        percentual >= 70;

    const analise =
        analisarResultados();

    salvarResultadoDoAluno(
        percentual,
        analise
    );

    if (aprovado) {
        salvarConclusaoDoTeste();

        mostrarResultadoAprovado(
            acertos,
            percentual
        );

    } else {
        mostrarResultadoParaRevisao(
            acertos,
            percentual
        );
    }
}


// ==========================================
// RESULTADO APROVADO
// ==========================================

function mostrarResultadoAprovado(
    acertos,
    percentual
) {
    const mensagem =
        "Você acertou " +
        acertos +
        " de " +
        perguntas.length +
        " questões.";

    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "success",
            title: "Etapa concluída!",
            text: mensagem,
            confirmButtonText:
                "Ir para a próxima aula",
            confirmButtonColor:
                "#1d3557",

            allowOutsideClick:
                false
        }).then(function () {
            voltarParaCurso();
        });

        return;
    }

    alert(
        "Etapa concluída!\n\n" +
        mensagem
    );

    voltarParaCurso();
}


// ==========================================
// RESULTADO PARA REVISÃO
// ==========================================

function mostrarResultadoParaRevisao(
    acertos,
    percentual
) {
    const mensagem =
        "Você acertou " +
        acertos +
        " de " +
        perguntas.length +
        " questões (" +
        percentual +
        "%). Reveja a aula e tente novamente.";

    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "warning",
            title: "Vamos revisar?",
            text: mensagem,

            showCancelButton: true,

            confirmButtonText:
                "Tentar novamente",

            cancelButtonText:
                "Voltar ao curso",

            confirmButtonColor:
                "#1d3557",

            cancelButtonColor:
                "#5fa8d3"
        }).then(function (resultado) {
            if (resultado.isConfirmed) {
                reiniciarJogo();
            } else {
                voltarParaCurso();
            }
        });

        return;
    }

    const tentarNovamente =
        confirm(mensagem);

    if (tentarNovamente) {
        reiniciarJogo();
    } else {
        voltarParaCurso();
    }
}


// ==========================================
// REINICIAR
// ==========================================

function reiniciarJogo() {
    perguntaAtual = 0;
    pontos = 0;
    vidas = 3;
    respostaBloqueada = false;
    resultadosDoTeste = [];

    atualizarStatus();
    carregarPergunta();
}


// ==========================================
// VOLTAR AO CURSO
// ==========================================

function voltarParaCurso() {
    sessionStorage.removeItem(
        "testeCursoAtual"
    );

    window.location.href =
        "potenciacao.html";
}


function voltarPagina() {
    window.location.href =
        "potenciacao.html";
}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        atualizarStatus();
        carregarPergunta();
    }
);
