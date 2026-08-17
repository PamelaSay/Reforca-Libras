/* ==========================================
   OPERAÇÃO POTÊNCIA
   JOGO DAS PROPRIEDADES
========================================== */


/* ==========================================
   DESAFIOS
========================================== */

const desafios = [
    {
        nucleo: 1,

        topico:
            "Produto de potências",

        tipo:
            "IDENTIFIQUE A PROPRIEDADE",

        enunciado:
            "Qual propriedade foi utilizada nesta transformação?",

        expressao:
            "2³ × 2⁴ = 2⁷",

        representacao: [
            {
                texto: "2³",
                classe: "bloco-potencia"
            },
            {
                texto: "×",
                classe: "simbolo-operacao"
            },
            {
                texto: "2⁴",
                classe: "bloco-potencia"
            },
            {
                texto: "→",
                classe: "simbolo-operacao"
            },
            {
                texto: "3 + 4 = 7",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "Produto de potências de mesma base",
            "Quociente de potências",
            "Potência de potência",
            "Potência de um produto"
        ],

        correta: 0,

        dica:
            "Observe que as bases são iguais e os expoentes foram somados.",

        explicacao:
            "No produto de potências de mesma base, conservamos a base e somamos os expoentes: 2³ × 2⁴ = 2³⁺⁴ = 2⁷.",

        videoPergunta: ""videos/propriedades/pergunta-01.mp4"",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 1,

        topico:
            "Produto de potências",

        tipo:
            "COMPLETE O EXPOENTE",

        enunciado:
            "Qual expoente completa corretamente a igualdade?",

        expressao:
            "5² × 5ⁿ = 5⁷",

        representacao: [
            {
                texto: "2",
                classe: "bloco-potencia"
            },
            {
                texto: "+",
                classe: "simbolo-operacao"
            },
            {
                texto: "n",
                classe: "espaco-resposta"
            },
            {
                texto: "=",
                classe: "simbolo-operacao"
            },
            {
                texto: "7",
                classe: "bloco-potencia"
            }
        ],

        alternativas: [
            "n = 3",
            "n = 5",
            "n = 9",
            "n = 14"
        ],

        correta: 1,

        dica:
            "Descubra qual número somado a 2 resulta em 7.",

        explicacao:
            "Como 2 + 5 = 7, o expoente que falta é 5. Portanto, 5² × 5⁵ = 5⁷.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 2,

        topico:
            "Quociente de potências",

        tipo:
            "ESCOLHA O RESULTADO",

        enunciado:
            "Simplifique a divisão de potências.",

        expressao:
            "7⁸ ÷ 7³",

        representacao: [
            {
                texto: "7⁸",
                classe: "bloco-potencia"
            },
            {
                texto: "÷",
                classe: "simbolo-operacao"
            },
            {
                texto: "7³",
                classe: "bloco-potencia"
            },
            {
                texto: "→",
                classe: "simbolo-operacao"
            },
            {
                texto: "8 − 3",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "7¹¹",
            "7⁵",
            "7²⁴",
            "1⁵"
        ],

        correta: 1,

        dica:
            "Na divisão de potências de mesma base, subtraímos os expoentes.",

        explicacao:
            "Conservamos a base 7 e subtraímos os expoentes: 7⁸ ÷ 7³ = 7⁸⁻³ = 7⁵.",

        video:
            ""
    },


    {
        nucleo: 2,

        topico:
            "Quociente de potências",

        tipo:
            "ENCONTRE O ERRO",

        enunciado:
            "Um estudante escreveu x⁹ ÷ x⁴ = x¹³. Qual foi o erro?",

        expressao:
            "x⁹ ÷ x⁴ = x¹³",

        representacao: [
            {
                texto: "9",
                classe: "bloco-potencia"
            },
            {
                texto: "+",
                classe: "simbolo-operacao"
            },
            {
                texto: "4",
                classe: "bloco-potencia"
            },
            {
                texto: "=",
                classe: "simbolo-operacao"
            },
            {
                texto: "13",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "Ele deveria multiplicar os expoentes",
            "Ele deveria conservar os expoentes",
            "Ele deveria subtrair os expoentes",
            "Ele deveria trocar a base"
        ],

        correta: 2,

        dica:
            "Observe que a operação entre as potências é uma divisão.",

        explicacao:
            "O estudante somou os expoentes, mas deveria subtraí-los: x⁹ ÷ x⁴ = x⁹⁻⁴ = x⁵.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 3,

        topico:
            "Potência de potência",

        tipo:
            "CONSERTE A MÁQUINA",

        enunciado:
            "A máquina aplicou a regra incorretamente. Escolha o resultado correto.",

        expressao:
            "(3²)⁴",

        representacao: [
            {
                texto: "3²",
                classe: "bloco-potencia"
            },
            {
                texto: "elevado a 4",
                classe: "espaco-resposta"
            },
            {
                texto: "→",
                classe: "simbolo-operacao"
            },
            {
                texto: "2 × 4",
                classe: "bloco-potencia"
            }
        ],

        alternativas: [
            "3⁶",
            "3⁸",
            "3¹⁶",
            "12²"
        ],

        correta: 1,

        dica:
            "Em uma potência de potência, os expoentes são multiplicados.",

        explicacao:
            "Conservamos a base 3 e multiplicamos os expoentes: (3²)⁴ = 3²·⁴ = 3⁸.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 3,

        topico:
            "Potência de potência",

        tipo:
            "COMPLETE A REGRA",

        enunciado:
            "Qual número deve ocupar o lugar da interrogação?",

        expressao:
            "(a³)⁵ = aⁿ",

        representacao: [
            {
                texto: "3",
                classe: "bloco-potencia"
            },
            {
                texto: "×",
                classe: "simbolo-operacao"
            },
            {
                texto: "5",
                classe: "bloco-potencia"
            },
            {
                texto: "=",
                classe: "simbolo-operacao"
            },
            {
                texto: "n",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "n = 8",
            "n = 15",
            "n = 2",
            "n = 35"
        ],

        correta: 1,

        dica:
            "Multiplique o expoente interno pelo expoente externo.",

        explicacao:
            "Os expoentes devem ser multiplicados: 3 × 5 = 15. Portanto, (a³)⁵ = a¹⁵.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 4,

        topico:
            "Potência de um produto",

        tipo:
            "DISTRIBUA A ENERGIA",

        enunciado:
            "Distribua corretamente o expoente entre os fatores.",

        expressao:
            "(2 × 5)³",

        representacao: [
            {
                texto: "2",
                classe: "bloco-potencia"
            },
            {
                texto: "×",
                classe: "simbolo-operacao"
            },
            {
                texto: "5",
                classe: "bloco-potencia"
            },
            {
                texto: "expoente 3",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "2³ × 5",
            "2 × 5³",
            "2³ × 5³",
            "2⁵ × 5²"
        ],

        correta: 2,

        dica:
            "O expoente deve ser aplicado a todos os fatores do produto.",

        explicacao:
            "Na potência de um produto, cada fator recebe o expoente: (2 × 5)³ = 2³ × 5³.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 4,

        topico:
            "Potência de um quociente",

        tipo:
            "ESCOLHA A TRANSFORMAÇÃO",

        enunciado:
            "Qual transformação está correta?",

        expressao:
            "(a ÷ b)⁴",

        representacao: [
            {
                texto: "a",
                classe: "bloco-potencia"
            },
            {
                texto: "÷",
                classe: "simbolo-operacao"
            },
            {
                texto: "b",
                classe: "bloco-potencia"
            },
            {
                texto: "expoente 4",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "a⁴ ÷ b",
            "a ÷ b⁴",
            "a⁴ ÷ b⁴",
            "a⁸ ÷ b⁸"
        ],

        correta: 2,

        dica:
            "O expoente deve ser aplicado ao dividendo e ao divisor.",

        explicacao:
            "Na potência de um quociente, o expoente é aplicado aos dois termos: (a ÷ b)⁴ = a⁴ ÷ b⁴.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 4,

        topico:
            "Aplicação das propriedades",

        tipo:
            "DESAFIO COMBINADO",

        enunciado:
            "Resolva usando mais de uma propriedade.",

        expressao:
            "(2³ × 2⁴) ÷ 2⁵",

        representacao: [
            {
                texto: "3 + 4",
                classe: "bloco-potencia"
            },
            {
                texto: "−",
                classe: "simbolo-operacao"
            },
            {
                texto: "5",
                classe: "bloco-potencia"
            },
            {
                texto: "=",
                classe: "simbolo-operacao"
            },
            {
                texto: "?",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "2²",
            "2¹²",
            "2⁷",
            "4²"
        ],

        correta: 0,

        dica:
            "Primeiro some os expoentes do produto. Depois subtraia o expoente da divisão.",

        explicacao:
            "Primeiro: 2³ × 2⁴ = 2⁷. Depois: 2⁷ ÷ 2⁵ = 2².",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    },


    {
        nucleo: 4,

        topico:
            "Aplicação das propriedades",

        tipo:
            "DESAFIO FINAL",

        enunciado:
            "Qual é a simplificação correta da expressão?",

        expressao:
            "(x²)³ × x⁴",

        representacao: [
            {
                texto: "2 × 3",
                classe: "bloco-potencia"
            },
            {
                texto: "+",
                classe: "simbolo-operacao"
            },
            {
                texto: "4",
                classe: "bloco-potencia"
            },
            {
                texto: "=",
                classe: "simbolo-operacao"
            },
            {
                texto: "?",
                classe: "espaco-resposta"
            }
        ],

        alternativas: [
            "x⁹",
            "x¹⁰",
            "x²⁴",
            "x⁵"
        ],

        correta: 1,

        dica:
            "Multiplique os expoentes da potência de potência e depois some 4.",

        explicacao:
            "(x²)³ = x⁶. Depois, x⁶ × x⁴ = x⁶⁺⁴ = x¹⁰.",

        videoPergunta: "",
        videoDica: "",
        videoExplicacao: ""
    }
];


/* ==========================================
   ESTADO DO JOGO
========================================== */

let indiceDesafio = 0;
let pontos = 0;
let vidas = 3;
let sequencia = 0;
let respostaBloqueada = false;
let dicaUsada = false;

const resultados = [];


/* ==========================================
   ELEMENTOS DA TELA
========================================== */

const elementos = {};


/* ==========================================
   INICIAR
========================================== */

function iniciarJogo() {
    elementos.pontos =
        document.getElementById("pontos");

    elementos.faseAtual =
        document.getElementById("faseAtual");

    elementos.totalFases =
        document.getElementById("totalFases");

    elementos.tipoDesafio =
        document.getElementById("tipoDesafio");

    elementos.enunciado =
        document.getElementById("enunciado");

    elementos.expressao =
        document.getElementById("expressao");

    elementos.representacao =
        document.getElementById("representacao");

    elementos.alternativas =
        document.getElementById("alternativas");

    elementos.btnDica =
        document.getElementById("btnDica");

    elementos.dica =
        document.getElementById("dica");

    elementos.vidas =
        document.getElementById("vidas");

    elementos.sequencia =
        document.getElementById("sequenciaAcertos");

    elementos.energia =
        document.getElementById("energiaPreenchida");

    elementos.porcentagemEnergia =
        document.getElementById("porcentagemEnergia");

    elementos.barraEnergia =
        document.querySelector(".barra-energia");

    elementos.video =
        document.getElementById("videoLibras");

    elementos.fonteVideo =
        document.getElementById("fonteLibras");

    elementos.videoIndisponivel =
        document.getElementById("videoIndisponivel");

    elementos.btnRepetir =
        document.getElementById("btnRepetir");

    elementos.btnVoltar =
        document.getElementById("btnVoltar");

    elementos.btnSair =
        document.getElementById("btnSair");

    elementos.falaPersonagem =
        document.getElementById("falaPersonagem");


    elementos.totalFases.textContent =
        desafios.length;


    elementos.btnDica.addEventListener(
        "click",
        mostrarDica
    );

    elementos.btnRepetir.addEventListener(
        "click",
        repetirTraducao
    );

    elementos.btnVoltar.addEventListener(
        "click",
        voltarParaTrilha
    );

    elementos.btnSair.addEventListener(
        "click",
        confirmarSaida
    );


    carregarVideo(
    desafio.video);
}


/* ==========================================
   CARREGAR DESAFIO
========================================== */

function carregarDesafio() {
    respostaBloqueada = false;
    dicaUsada = false;

    const desafio =
        desafios[indiceDesafio];


    elementos.faseAtual.textContent =
        indiceDesafio + 1;

    elementos.tipoDesafio.textContent =
        desafio.tipo;

    elementos.enunciado.textContent =
        desafio.enunciado;

    elementos.expressao.textContent =
        desafio.expressao;


    elementos.dica.hidden = true;
    elementos.dica.textContent = "";

    elementos.btnDica.disabled = false;
    elementos.btnDica.innerHTML =
        "💡 Usar dica <small>−5 pontos</small>";


   criarRepresentacaoNeutra(
    desafio
);

    criarAlternativas(desafio);

    carregarVideo(
        desafio.video
    );

    atualizarTela();
}


/* ==========================================
   REPRESENTAÇÃO VISUAL
========================================== */
function criarRepresentacaoNeutra(
    desafio
) {
    elementos.representacao.replaceChildren();

    const mensagens = {
        "IDENTIFIQUE A PROPRIEDADE":
            "Observe como a expressão foi transformada.",

        "COMPLETE O EXPOENTE":
            "Descubra o valor que deve ocupar o lugar de n.",

        "ESCOLHA O RESULTADO":
            "Aplique a propriedade adequada.",

        "ENCONTRE O ERRO":
            "Compare a operação realizada com a propriedade correta.",

        "CONSERTE A MÁQUINA":
            "A máquina precisa receber o resultado correto.",

        "COMPLETE A REGRA":
            "Descubra o expoente que está faltando.",

        "DISTRIBUA A ENERGIA":
            "Observe quais fatores devem receber o expoente.",

        "ESCOLHA A TRANSFORMAÇÃO":
            "Escolha a transformação que preserva a igualdade.",

        "DESAFIO COMBINADO":
            "Resolva uma propriedade de cada vez.",

        "DESAFIO FINAL":
            "Analise a expressão antes de escolher a resposta."
    };

    const texto =
        document.createElement("span");

    texto.textContent =
        mensagens[desafio.tipo] ||
        "Analise a expressão e escolha a resposta.";

    elementos.representacao.appendChild(
        texto
    );
}

/* ==========================================
   CRIAR ALTERNATIVAS
========================================== */

function criarAlternativas(desafio) {
    elementos.alternativas.replaceChildren();

    const alternativas =
        desafio.alternativas.map(
            function (texto, indice) {
                return {
                    texto: texto,
                    indiceOriginal: indice
                };
            }
        );

    embaralhar(alternativas);

    alternativas.forEach(
        function (alternativa) {
            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className = "alternativa";
            botao.textContent =
                alternativa.texto;

            botao.dataset.indice =
                alternativa.indiceOriginal;

            botao.addEventListener(
                "click",
                function () {
                    verificarResposta(
                        alternativa.indiceOriginal,
                        botao
                    );
                }
            );

            elementos.alternativas.appendChild(
                botao
            );
        }
    );
}


/* ==========================================
   VERIFICAR RESPOSTA
========================================== */

async function verificarResposta(
    indiceEscolhido,
    botaoEscolhido
) {
    if (respostaBloqueada) {
        return;
    }

    respostaBloqueada = true;

    const desafio =
        desafios[indiceDesafio];

    const acertou =
        indiceEscolhido ===
        desafio.correta;


    const botoes =
        elementos.alternativas.querySelectorAll(
            ".alternativa"
        );


    botoes.forEach(function (botao) {
        botao.disabled = true;

        if (
            Number(botao.dataset.indice) ===
            desafio.correta
        ) {
            botao.classList.add("correta");
        }
    });


    if (acertou) {
        pontos += 10;
        sequencia += 1;

        botaoEscolhido.classList.add(
            "correta"
        );

        if (
            sequencia >= 3
        ) {
            pontos += 5;
        }

    } else {
        vidas -= 1;
        sequencia = 0;

        botaoEscolhido.classList.add(
            "incorreta"
        );
    }


    resultados.push({
        numeroQuestao:
            indiceDesafio + 1,

        nucleo:
            desafio.nucleo,

        topico:
            desafio.topico,

        enunciado:
            desafio.enunciado,

        respostaEscolhida:
            desafio.alternativas[
                indiceEscolhido
            ],

        respostaCorreta:
            desafio.alternativas[
                desafio.correta
            ],

        acertou:
            acertou,

        usouDica:
            dicaUsada
    });


    atualizarTela();


    await mostrarExplicacao(
        acertou,
        desafio
    );


    if (vidas <= 0) {
        finalizarJogo(false);
        return;
    }


    indiceDesafio += 1;


    if (
        indiceDesafio >=
        desafios.length
    ) {
        finalizarJogo(true);
        return;
    }


    carregarDesafio();
}


/* ==========================================
   EXPLICAÇÃO
========================================== */
function mostrarExplicacao(
    acertou,
    desafio
) {
    if (
        typeof Swal === "undefined"
    ) {
        alert(
            (
                acertou
                    ? "Resposta correta!"
                    : "Vamos revisar."
            ) +
            "\n\n" +
            desafio.explicacao
        );

        return Promise.resolve();
    }


    const possuiVideo =
        Boolean(
            desafio.videoExplicacao
        );


    const areaVideo = possuiVideo
        ? `
            <div class="alerta-libras">
                <h3>
                    ✋ Explicação em Libras
                </h3>

                <video
                    id="videoExplicacaoAlerta"
                    controls
                    playsinline
                    preload="metadata"
                >
                    <source
                        src="${desafio.videoExplicacao}"
                        type="video/mp4"
                    >

                    Seu navegador não reproduz
                    este vídeo.
                </video>

                <button
                    type="button"
                    id="repetirExplicacaoAlerta"
                    class="btn-repetir-alerta"
                >
                    ↻ Repetir tradução
                </button>
            </div>
        `
        : `
            <div class="alerta-libras indisponivel">
                <span>✋</span>

                <p>
                    A explicação em Libras
                    será adicionada aqui.
                </p>
            </div>
        `;


    return Swal.fire({
        icon:
            acertou
                ? "success"
                : "warning",

        title:
            acertou
                ? "Resposta correta!"
                : "Vamos revisar",

        html:
            `
                <p class="explicacao-alerta">
                    ${desafio.explicacao}
                </p>

                ${areaVideo}
            `,

        confirmButtonText:
            "Continuar",

        confirmButtonColor:
            "#1d3557",

        background:
            "#ffffff",

        color:
            "#1d3557",

        allowOutsideClick:
            false,

        allowEscapeKey:
            false,

        didOpen:
            function () {
                const video =
                    document.getElementById(
                        "videoExplicacaoAlerta"
                    );

                const botao =
                    document.getElementById(
                        "repetirExplicacaoAlerta"
                    );


                if (!video) {
                    return;
                }


                video.play().catch(
                    function () {
                        /*
                         * O usuário poderá iniciar
                         * pelos controles do vídeo.
                         */
                    }
                );


                if (botao) {
                    botao.addEventListener(
                        "click",
                        function () {
                            video.currentTime = 0;

                            video.play().catch(
                                function () {}
                            );
                        }
                    );
                }
            }
    });
}

/* ==========================================
   DICA
========================================== */

function mostrarDica() {
    if (
        dicaUsada ||
        respostaBloqueada
    ) {
        return;
    }

    dicaUsada = true;

    pontos = Math.max(
        0,
        pontos - 5
    );

    const desafio =
        desafios[indiceDesafio];

    elementos.dica.textContent =
        "💡 " + desafio.dica;

    elementos.dica.hidden = false;

    elementos.btnDica.disabled = true;

    elementos.btnDica.innerHTML =
        "💡 Dica utilizada";

    carregarVideo(
        desafio.videoDica ||
        desafio.videoPergunta
    );

    atualizarTela();
}


/* ==========================================
   VÍDEO EM LIBRAS
========================================== */

function carregarVideo(caminhoVideo) {
    elementos.video.pause();

    elementos.video.currentTime = 0;

    elementos.fonteVideo.src =
        caminhoVideo || "";

    elementos.video.load();


    if (!caminhoVideo) {
        elementos.video.hidden = true;

        elementos.videoIndisponivel.hidden =
            false;

        elementos.btnRepetir.disabled =
            true;

        return;
    }


    elementos.video.hidden = false;

    elementos.videoIndisponivel.hidden =
        true;

    elementos.btnRepetir.disabled =
        false;


    const reproducao =
        elementos.video.play();

    if (reproducao) {
        reproducao.catch(
            function () {
                /*
                 * Alguns navegadores aguardam
                 * uma interação antes de reproduzir.
                 */
            }
        );
    }
}


/* ==========================================
   REPETIR TRADUÇÃO
========================================== */

function repetirTraducao() {
    if (
        elementos.video.hidden ||
        !elementos.fonteVideo.src
    ) {
        return;
    }

    elementos.video.currentTime = 0;

    elementos.video.play().catch(
        function () {
            /*
             * O aluno ainda poderá usar
             * os controles do próprio vídeo.
             */
        }
    );
}


/* ==========================================
   ATUALIZAR TELA
========================================== */

function atualizarTela() {
    elementos.pontos.textContent =
        pontos;

    atualizarVidas();

    atualizarEnergia();

    atualizarSequencia();
}


/* ==========================================
   VIDAS
========================================== */

function atualizarVidas() {
    const coracoesAtivos =
        "❤️".repeat(
            Math.max(0, vidas)
        );

    const coracoesPerdidos =
        "🖤".repeat(
            Math.max(0, 3 - vidas)
        );

    elementos.vidas.textContent =
        coracoesAtivos +
        coracoesPerdidos;
}


/* ==========================================
   ENERGIA
========================================== */

function atualizarEnergia() {
    const quantidadeRespondida =
        resultados.length;

    const porcentagem =
        Math.round(
            (
                quantidadeRespondida /
                desafios.length
            ) *
            100
        );

    elementos.energia.style.width =
        porcentagem + "%";

    elementos.porcentagemEnergia.textContent =
        porcentagem + "%";

    elementos.barraEnergia.setAttribute(
        "aria-valuenow",
        porcentagem
    );


    elementos.energia.classList.remove(
        "animar"
    );

    void elementos.energia.offsetWidth;

    elementos.energia.classList.add(
        "animar"
    );
}


/* ==========================================
   SEQUÊNCIA DE ACERTOS
========================================== */

function atualizarSequencia() {
    if (sequencia < 2) {
        elementos.sequencia.hidden = true;
        return;
    }

    elementos.sequencia.hidden = false;

    elementos.sequencia.textContent =
        "🔥 " +
        sequencia +
        " acertos seguidos";

    if (sequencia >= 3) {
        elementos.sequencia.textContent +=
            " · bônus!";
    }
}


/* ==========================================
   ANALISAR RESULTADOS
========================================== */

function analisarResultados() {
    const desempenho = {};


    resultados.forEach(
        function (resultado) {
            const topico =
                resultado.topico;

            if (!desempenho[topico]) {
                desempenho[topico] = {
                    acertos: 0,
                    erros: 0,
                    total: 0,
                    percentual: 0
                };
            }

            desempenho[topico].total += 1;

            if (resultado.acertou) {
                desempenho[topico]
                    .acertos += 1;
            } else {
                desempenho[topico]
                    .erros += 1;
            }
        }
    );


    const dificuldades = [];


    Object.keys(desempenho).forEach(
        function (topico) {
            const dados =
                desempenho[topico];

            dados.percentual =
                Math.round(
                    (
                        dados.acertos /
                        dados.total
                    ) *
                    100
                );

            if (
                dados.percentual < 70
            ) {
                dificuldades.push(
                    topico
                );
            }
        }
    );


    return {
        desempenho:
            desempenho,

        dificuldades:
            dificuldades
    };
}


/* ==========================================
   SALVAR RESULTADO LOCAL
========================================== */

function salvarResultado(
    concluiu
) {
    const quantidadeAcertos =
        resultados.filter(
            function (resultado) {
                return resultado.acertou;
            }
        ).length;


    const percentual =
        Math.round(
            (
                quantidadeAcertos /
                desafios.length
            ) *
            100
        );


    const analise =
        analisarResultados();


    const resultadoFinal = {
        tematica:
            "Potenciação",

        conteudo:
            "Propriedades da potenciação",

        etapa:
            4,

        concluiu:
            concluiu,

        pontuacao:
            pontos,

        acertos:
            quantidadeAcertos,

        totalQuestoes:
            desafios.length,

        percentual:
            percentual,

        respostas:
            resultados,

        desempenhoPorTopico:
            analise.desempenho,

        dificuldades:
            analise.dificuldades,

        realizadoEm:
            new Date().toISOString()
    };


    let historico = [];


    try {
        historico =
            JSON.parse(
                localStorage.getItem(
                    "resultadosPotenciacao"
                )
            ) || [];

    } catch (erro) {
        historico = [];
    }


    historico.push(
        resultadoFinal
    );


    localStorage.setItem(
        "resultadosPotenciacao",
        JSON.stringify(historico)
    );


    if (concluiu) {
        concluirEtapa();
    }


    return resultadoFinal;
}


/* ==========================================
   CONCLUIR ETAPA DA TRILHA
========================================== */

function concluirEtapa() {
    let progresso = null;


    try {
        progresso =
            JSON.parse(
                localStorage.getItem(
                    "progressoCursoPotenciacao"
                )
            );

    } catch (erro) {
        progresso = null;
    }


    if (!progresso) {
        progresso = {
            etapaLiberada: 4,
            aulasAssistidas: [],
            concluidas: []
        };
    }


    if (
        !Array.isArray(
            progresso.concluidas
        )
    ) {
        progresso.concluidas = [];
    }


    if (
        !progresso.concluidas.includes(4)
    ) {
        progresso.concluidas.push(4);
    }


    progresso.etapaLiberada = 4;


    localStorage.setItem(
        "progressoCursoPotenciacao",
        JSON.stringify(progresso)
    );
}


/* ==========================================
   FINALIZAR JOGO
========================================== */

async function finalizarJogo(
    concluiu
) {
    const resultadoFinal =
        salvarResultado(concluiu);


    if (
        typeof Swal === "undefined"
    ) {
        alert(
            "Pontuação: " +
            resultadoFinal.pontuacao
        );

        voltarParaTrilha();
        return;
    }


    const dificuldades =
        resultadoFinal.dificuldades;


    const textoDificuldades =
        dificuldades.length === 0
            ? (
                "<p>Você recuperou todos " +
                "os núcleos de energia!</p>"
            )
            : (
                "<p><strong>Conteúdos para revisar:</strong></p>" +
                "<p>" +
                dificuldades.join("<br>") +
                "</p>"
            );


    const resultadoAlerta =
        await Swal.fire({
            icon:
                concluiu
                    ? "success"
                    : "warning",

            title:
                concluiu
                    ? "Central restaurada!"
                    : "A energia acabou!",

            html:
                "<p>Você acertou <strong>" +
                resultadoFinal.acertos +
                " de " +
                resultadoFinal.totalQuestoes +
                "</strong> desafios.</p>" +

                "<p>Pontuação: <strong>" +
                resultadoFinal.pontuacao +
                "</strong></p>" +

                textoDificuldades +

                "<br>" +

                "<p>Sua opinião ajuda o " +
                "Reforça Libras a melhorar.</p>",

            showDenyButton: true,
            showCancelButton: true,

            confirmButtonText:
                "Jogar novamente",

            denyButtonText:
                "Avaliar o jogo",

            cancelButtonText:
                "Voltar para a trilha",

            confirmButtonColor:
                "#1d3557",

            denyButtonColor:
                "#5fa8d3",

            cancelButtonColor:
                "#64748b",

            allowOutsideClick:
                false
        });


    if (
        resultadoAlerta.isConfirmed
    ) {
        reiniciarJogo();
        return;
    }


    if (
        resultadoAlerta.isDenied
    ) {
        window.location.href =
            "index.html#avaliacao";

        return;
    }


    voltarParaTrilha();
}


/* ==========================================
   REINICIAR
========================================== */

function reiniciarJogo() {
    indiceDesafio = 0;
    pontos = 0;
    vidas = 3;
    sequencia = 0;
    respostaBloqueada = false;
    dicaUsada = false;

    resultados.length = 0;

    document
        .querySelectorAll(".nucleo")
        .forEach(
            function (nucleo) {
                nucleo.classList.remove(
                    "ativo",
                    "concluido"
                );
            }
        );


    carregarDesafio();
}


/* ==========================================
   SAIR
========================================== */

function confirmarSaida() {
    if (
        typeof Swal === "undefined"
    ) {
        voltarParaTrilha();
        return;
    }


    Swal.fire({
        icon:
            "question",

        title:
            "Sair da missão?",

        text:
            "O progresso desta tentativa não será salvo.",

        showCancelButton:
            true,

        confirmButtonText:
            "Sim, sair",

        cancelButtonText:
            "Continuar jogando",

        confirmButtonColor:
            "#1d3557"
    }).then(
        function (resultado) {
            if (
                resultado.isConfirmed
            ) {
                voltarParaTrilha();
            }
        }
    );
}


function voltarParaTrilha() {
    window.location.href =
        "potenciacao.html";
}


/* ==========================================
   EMBARALHAR
========================================== */

function embaralhar(lista) {
    for (
        let indice =
            lista.length - 1;

        indice > 0;

        indice -= 1
    ) {
        const outroIndice =
            Math.floor(
                Math.random() *
                (indice + 1)
            );


        const temporario =
            lista[indice];

        lista[indice] =
            lista[outroIndice];

        lista[outroIndice] =
            temporario;
    }


    return lista;
}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarJogo
);