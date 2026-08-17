// ==========================================
// PERGUNTAS DO JOGO
// ==========================================

const perguntas = [
    {
        radicando: 25,
        resposta: 5,
        video: ""
    },
    {
        radicando: 36,
        resposta: 6,
        video: ""
    },
    {
        radicando: 49,
        resposta: 7,
        video: ""
    },
    {
        radicando: 64,
        resposta: 8,
        video: ""
    },
    {
        radicando: 81,
        resposta: 9,
        video: ""
    },
    {
        radicando: 16,
        resposta: 4,
        video: ""
    },
    {
        radicando: 100,
        resposta: 10,
        video: ""
    },
    {
        radicando: 9,
        resposta: 3,
        video: ""
    },
    {
        radicando: 121,
        resposta: 11,
        video: ""
    },
    {
        radicando: 144,
        resposta: 12,
        video: ""
    }
];


// ==========================================
// ESTADO DO JOGO
// ==========================================

let faseAtual = 0;
let pontos = 0;
let vidas = 3;
let bloqueado = false;
let resultadosDoTeste = [];


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

let elementoPontos;
let elementoFase;
let elementoVidas;
let elementoPergunta;
let elementoQuadrado;
let elementoAlternativas;
let elementoProgresso;
let elementoVideo;
let elementoFonteVideo;
let botaoRepetirVideo;


// ==========================================
// INICIAR O JOGO
// ==========================================

function iniciarJogo() {
    elementoPontos =
        document.getElementById("pontos");

    elementoFase =
        document.getElementById("fase");

    elementoVidas =
        document.getElementById("vidas");

    elementoPergunta =
        document.getElementById("textoPergunta");

    elementoQuadrado =
        document.getElementById("quadrado");

    elementoAlternativas =
        document.getElementById("alternativas");

    elementoProgresso =
        document.getElementById("progresso");

    elementoVideo =
        document.getElementById("videoLibras");

    elementoFonteVideo =
        document.getElementById("fonteLibras");

    botaoRepetirVideo =
        document.getElementById("repetirLibras");

    if (
        !elementoPontos ||
        !elementoFase ||
        !elementoVidas ||
        !elementoPergunta ||
        !elementoQuadrado ||
        !elementoAlternativas ||
        !elementoProgresso
    ) {
        console.error(
            "Um ou mais elementos do jogo não foram encontrados no HTML."
        );

        return;
    }

    if (botaoRepetirVideo) {
        botaoRepetirVideo.addEventListener(
            "click",
            repetirTraducao
        );
    }

    embaralhar(perguntas);
    mostrarPergunta();
    atualizarStatus();
}


// ==========================================
// MOSTRAR PERGUNTA
// ==========================================

function mostrarPergunta() {
    bloqueado = false;

    const perguntaAtual =
        perguntas[faseAtual];

    elementoPergunta.textContent =
        "Qual é a raiz quadrada de " +
        perguntaAtual.radicando +
        "?";

    criarRepresentacao(
        perguntaAtual.resposta
    );

    criarAlternativas(
        perguntaAtual.resposta
    );

    carregarLibras(
        perguntaAtual.video
    );

    atualizarStatus();
}


// ==========================================
// CRIAR REPRESENTAÇÃO VISUAL
// ==========================================

function criarRepresentacao(lado) {
    elementoQuadrado.innerHTML = "";

    elementoQuadrado.style.setProperty(
        "--lado",
        lado
    );

    const quantidade = lado * lado;

    for (
        let numero = 0;
        numero < quantidade;
        numero++
    ) {
        const celula =
            document.createElement("div");

        celula.className = "quad";

        elementoQuadrado.appendChild(celula);
    }
}


// ==========================================
// CRIAR ALTERNATIVAS
// ==========================================

function criarAlternativas(respostaCorreta) {
    const opcoes =
        new Set([respostaCorreta]);

    while (opcoes.size < 4) {
        const deslocamento =
            Math.floor(Math.random() * 7) - 3;

        const opcao =
            respostaCorreta + deslocamento;

        if (opcao > 0) {
            opcoes.add(opcao);
        }
    }

    const alternativas =
        embaralhar(Array.from(opcoes));

    elementoAlternativas.innerHTML = "";

    alternativas.forEach(
        function (valor) {
            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.textContent = valor;

            botao.addEventListener(
                "click",
                function () {
                    verificar(valor);
                }
            );

            elementoAlternativas.appendChild(botao);
        }
    );
}


// ==========================================
// VERIFICAR RESPOSTA
// ==========================================

async function verificar(valor) {
    if (bloqueado) {
        return;
    }

    bloqueado = true;
    desativarAlternativas();

    const perguntaAtual =
        perguntas[faseAtual];

    const acertou =
        valor === perguntaAtual.resposta;

    resultadosDoTeste.push({
        radicando: perguntaAtual.radicando,
        respostaEscolhida: valor,
        respostaCorreta: perguntaAtual.resposta,
        acertou: acertou
    });

    if (acertou) {
        pontos += 10;

        atualizarStatus();

        await mostrarAlerta({
            icon: "success",
            title: "Muito bem!",
            text:
                "√" +
                perguntaAtual.radicando +
                " = " +
                perguntaAtual.resposta,
            timer: 1400
        });

    } else {
        vidas--;

        atualizarStatus();

        await mostrarAlerta({
            icon: "error",
            title: "Quase!",
            text:
                "A resposta correta é " +
                perguntaAtual.resposta +
                ", pois " +
                perguntaAtual.resposta +
                " × " +
                perguntaAtual.resposta +
                " = " +
                perguntaAtual.radicando +
                ".",
            timer: 2400
        });
    }

    if (vidas <= 0) {
        finalizarJogo(false);
        return;
    }

    faseAtual++;

    if (faseAtual >= perguntas.length) {
        finalizarJogo(true);
        return;
    }

    mostrarPergunta();
}


// ==========================================
// ALERTA DE RESPOSTA
// ==========================================

function mostrarAlerta(configuracao) {
    if (typeof Swal !== "undefined") {
        return Swal.fire({
            icon: configuracao.icon,
            title: configuracao.title,
            text: configuracao.text,
            timer: configuracao.timer,
            showConfirmButton: false,
            background: "#ffffff",
            color: "#1d3557"
        });
    }

    alert(
        configuracao.title +
        "\n" +
        configuracao.text
    );

    return Promise.resolve();
}


// ==========================================
// FINALIZAR JOGO
// ==========================================

function salvarResultadoRadiciacao(concluiu) {
    const acertos = resultadosDoTeste.filter(function (resultado) {
        return resultado.acertou;
    }).length;

    const percentual = perguntas.length
        ? Math.round((acertos / perguntas.length) * 100)
        : 0;

    let historico = [];
    try {
        historico = JSON.parse(
            localStorage.getItem(chaveLocalDoUsuario("resultadosRadiciacao"))
        ) || [];
    } catch (erro) {
        historico = [];
    }

    const resultadoAtual = {
        etapa: Number(sessionStorage.getItem("testeCursoAtual")) || 1,
        pontuacao: pontos,
        percentual: percentual,
        respostas: resultadosDoTeste,
        concluido: concluiu,
        realizadoEm: new Date().toISOString()
    };

    historico.push(resultadoAtual);

    localStorage.setItem(
        chaveLocalDoUsuario("resultadosRadiciacao"),
        JSON.stringify(historico)
    );

    salvarResultadoRadiciacaoNoFirebase(resultadoAtual);

    if (concluiu) {
        let progresso = null;
        try {
            progresso = JSON.parse(
                localStorage.getItem(chaveLocalDoUsuario("progressoCursoRadiciacao"))
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

        const etapa = Number(sessionStorage.getItem("testeCursoAtual")) || 1;
        if (!Array.isArray(progresso.concluidas)) progresso.concluidas = [];
        if (!progresso.concluidas.includes(etapa)) progresso.concluidas.push(etapa);
        progresso.etapaLiberada = Math.min(4, Math.max(progresso.etapaLiberada || 1, etapa + 1));
        localStorage.setItem(
            chaveLocalDoUsuario("progressoCursoRadiciacao"),
            JSON.stringify(progresso)
        );
    }
}

function salvarResultadoRadiciacaoNoFirebase(resultado) {
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
            tematica: "Radiciação",
            etapa: resultado.etapa,
            pontuacao: resultado.pontuacao,
            percentual: resultado.percentual,
            respostas: resultado.respostas,
            concluido: resultado.concluido,
            realizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(function (erro) {
            console.error("Erro ao salvar resultado da Radiciação:", erro);
        });
}

async function finalizarJogo(concluiu) {
    salvarResultadoRadiciacao(concluiu);

    if (typeof Swal === "undefined") {
        alert(
            concluiu
                ? "Missão concluída! Pontuação: " + pontos
                : "Game Over! Pontuação: " + pontos
        );

        reiniciarJogo();
        return;
    }

    const resultado = await Swal.fire({
        icon: concluiu
            ? "success"
            : "error",

        title: concluiu
            ? "Missão concluída!"
            : "Game Over",

        html: concluiu
            ? (
                "Você completou as 10 fases." +
                "<br><strong>Pontuação: " +
                pontos +
                "</strong>"
            )
            : (
                "Suas vidas terminaram." +
                "<br><strong>Pontuação: " +
                pontos +
                "</strong>"
            ),

        showCancelButton: true,

        confirmButtonText:
            "Jogar novamente",

        cancelButtonText:
            "Sair do jogo",

        confirmButtonColor:
            "#1d3557",

        cancelButtonColor:
            "#5fa8d3"
    });

    if (resultado.isConfirmed) {
        reiniciarJogo();
    } else {
        window.history.back();
    }
}


// ==========================================
// REINICIAR JOGO
// ==========================================

function reiniciarJogo() {
    faseAtual = 0;
    pontos = 0;
    vidas = 3;
    bloqueado = false;
    resultadosDoTeste = [];

    embaralhar(perguntas);

    mostrarPergunta();
    atualizarStatus();
}


// ==========================================
// CARREGAR TRADUÇÃO EM LIBRAS
// ==========================================

function carregarLibras(nomeDoVideo) {
    if (
        !elementoVideo ||
        !elementoFonteVideo
    ) {
        return;
    }

    const aviso = document.getElementById("avisoLibras");

    if (!nomeDoVideo) {
        elementoVideo.hidden = true;
        if (botaoRepetirVideo) botaoRepetirVideo.hidden = true;
        if (aviso) aviso.hidden = false;
        return;
    }

    elementoVideo.hidden = false;
    if (botaoRepetirVideo) botaoRepetirVideo.hidden = false;
    if (aviso) aviso.hidden = true;
    elementoFonteVideo.src = nomeDoVideo;

    elementoVideo.load();
    elementoVideo.currentTime = 0;

    const reproducao =
        elementoVideo.play();

    if (reproducao) {
        reproducao.catch(
            function () {
                console.log(
                    "O navegador aguardará uma interação para reproduzir o vídeo."
                );
            }
        );
    }
}


// ==========================================
// REPETIR TRADUÇÃO
// ==========================================

function repetirTraducao() {
    if (!elementoVideo) {
        return;
    }

    elementoVideo.currentTime = 0;

    const reproducao =
        elementoVideo.play();

    if (reproducao) {
        reproducao.catch(
            function (erro) {
                console.error(
                    "Não foi possível repetir o vídeo:",
                    erro
                );
            }
        );
    }
}


// ==========================================
// ATUALIZAR PLACAR E PROGRESSO
// ==========================================

function atualizarStatus() {
    elementoPontos.textContent = pontos;

    elementoFase.textContent =
        Math.min(
            faseAtual + 1,
            perguntas.length
        );

    elementoVidas.textContent = vidas;

    const porcentagem =
        ((faseAtual + 1) /
            perguntas.length) *
        100;

    elementoProgresso.style.width =
        porcentagem + "%";

    const barra =
        elementoProgresso.parentElement;

    if (barra) {
        barra.setAttribute(
            "aria-valuenow",
            Math.round(porcentagem)
        );
    }
}


// ==========================================
// BLOQUEAR ALTERNATIVAS
// ==========================================

function desativarAlternativas() {
    const botoes =
        elementoAlternativas.querySelectorAll(
            "button"
        );

    botoes.forEach(
        function (botao) {
            botao.disabled = true;
        }
    );
}


// ==========================================
// EMBARALHAR
// ==========================================

function embaralhar(lista) {
    for (
        let indice = lista.length - 1;
        indice > 0;
        indice--
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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarJogo
);
