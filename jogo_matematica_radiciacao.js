// ==========================================
// PERGUNTAS DO JOGO
// ==========================================

const VIDEO_TESTE_LIBRAS =
    "https://www.youtube.com/embed/r9AoQVkUUvU";

const perguntas = [
    {
        radicando: 25,
        resposta: 5,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 36,
        resposta: 6,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 49,
        resposta: 7,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 64,
        resposta: 8,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 81,
        resposta: 9,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 16,
        resposta: 4,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 100,
        resposta: 10,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 9,
        resposta: 3,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 121,
        resposta: 11,
        video: VIDEO_TESTE_LIBRAS
    },
    {
        radicando: 144,
        resposta: 12,
        video: VIDEO_TESTE_LIBRAS
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
let sequencia = 0;


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

let elementoPontos;
let elementoFase;
let elementoTotalQuestoes;
let elementoVidas;
let elementoPergunta;
let elementoQuadrado;
let elementoAlternativas;
let elementoProgresso;
let elementoVideo;
let botaoRepetirVideo;
let elementoVideoIndisponivel;
let elementoPorcentagem;
let elementoSequencia;
let botaoDica;
let areaDica;


// ==========================================
// INICIAR O JOGO
// ==========================================

function iniciarJogo() {
    elementoPontos =
        document.getElementById("pontos");

    elementoFase =
        document.getElementById("questaoAtual");

    elementoTotalQuestoes =
        document.getElementById("totalQuestoes");

    elementoVidas =
        document.getElementById("vidas");

    elementoPergunta =
        document.getElementById("textoPergunta");

    elementoQuadrado =
        document.getElementById("quadrado");

    elementoAlternativas =
        document.getElementById("alternativas");

    elementoProgresso =
        document.getElementById("preenchimentoProgresso");

    elementoVideo =
        document.getElementById("videoLibras");

    botaoRepetirVideo =
        document.getElementById("botaoRepetirLibras");

    elementoVideoIndisponivel =
        document.getElementById("videoIndisponivel");

    elementoPorcentagem =
        document.getElementById("porcentagemProgresso");

    elementoSequencia =
        document.getElementById("valorSequencia");

    botaoDica =
        document.getElementById("botaoDica");

    areaDica =
        document.getElementById("areaDica");

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

    configurarControlesDaTela();

    if (elementoTotalQuestoes) {
        elementoTotalQuestoes.textContent = perguntas.length;
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

    if (areaDica && botaoDica) {
        areaDica.hidden = true;
        botaoDica.setAttribute("aria-expanded", "false");
        botaoDica.textContent = "💡 Ver dica";
    }

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
        function (valor, indice) {
            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className = "botao-alternativa";
            botao.dataset.valor = String(valor);

            const letra = String.fromCharCode(65 + indice);

            botao.innerHTML =
                '<span class="letra-alternativa">' +
                letra +
                "</span>" +
                "<span>" +
                valor +
                "</span>";

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
        sequencia++;

        marcarAlternativas(
            valor,
            perguntaAtual.resposta
        );

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
        sequencia = 0;

        marcarAlternativas(
            valor,
            perguntaAtual.resposta
        );

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

    atualizarStatus();

    if (faseAtual >= perguntas.length) {
        finalizarJogo(true);
        return;
    }

    mostrarPergunta();
}


// ==========================================
// ALERTA DE RESPOSTA
// ==========================================

function conteudoAlertaComLibras(texto) {
    return `
        <div style="display:grid;gap:12px;text-align:left;">
            <div style="padding:12px;background:#f2fbff;border-left:5px solid #5fa8d3;border-radius:12px;">
                ${texto}
            </div>

            <iframe
                id="videoAlertaRadiciacao"
                src="${VIDEO_TESTE_LIBRAS}?rel=0&modestbranding=1"
                title="Tradução do alerta do jogo de Radiciação em Libras"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="width:100%;height:250px;background:#000;border:2px solid #5fa8d3;border-radius:14px;"
            ></iframe>

            <button
                id="repetirAlertaRadiciacao"
                type="button"
                style="width:100%;padding:9px 12px;background:#dff4ff;color:#1d3557;border:2px solid #5fa8d3;border-radius:12px;font-weight:900;cursor:pointer;"
            >
                ↻ Repetir tradução em Libras
            </button>
        </div>
    `;
}

function ativarTraducaoDoAlerta() {
    const video = document.getElementById(
        "videoAlertaRadiciacao"
    );

    const botao = document.getElementById(
        "repetirAlertaRadiciacao"
    );

    if (!video || !botao) return;

    botao.addEventListener("click", function () {
        video.src = "";

        setTimeout(function () {
            video.src =
                VIDEO_TESTE_LIBRAS +
                "?rel=0&modestbranding=1&autoplay=1";
        }, 100);
    });
}

function pararTraducaoDoAlerta() {
    const video = document.getElementById(
        "videoAlertaRadiciacao"
    );

    if (video) video.src = "";
}

function mostrarAlerta(configuracao) {
    if (typeof Swal !== "undefined") {
        return Swal.fire({
            icon: configuracao.icon,
            title: configuracao.title,
            html: conteudoAlertaComLibras(
                configuracao.text
            ),
            confirmButtonText: "Continuar",
            confirmButtonColor: "#1d3557",
            allowOutsideClick: false,
            background: "#ffffff",
            color: "#1d3557",
            customClass: {
                popup: "alerta-reforca"
            },
            didOpen: ativarTraducaoDoAlerta,
            willClose: pararTraducaoDoAlerta
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

        html: conteudoAlertaComLibras(
            concluiu
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
                )
        ),

        showCancelButton: true,

        confirmButtonText:
            "Jogar novamente",

        cancelButtonText:
            "Sair do jogo",

        confirmButtonColor:
            "#1d3557",

        cancelButtonColor:
            "#5fa8d3",

        allowOutsideClick: false,

        customClass: {
            popup: "alerta-reforca"
        },

        didOpen: ativarTraducaoDoAlerta,
        willClose: pararTraducaoDoAlerta
    });

    if (resultado.isConfirmed) {
        reiniciarJogo();
    } else {
        window.location.href = "radiciacao.html";
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
    sequencia = 0;

    embaralhar(perguntas);

    mostrarPergunta();
    atualizarStatus();
}


// ==========================================
// CARREGAR TRADUÇÃO EM LIBRAS
// ==========================================

function carregarLibras(nomeDoVideo) {
    if (!elementoVideo) {
        return;
    }

    if (!nomeDoVideo) {
        elementoVideo.hidden = true;
        if (botaoRepetirVideo) botaoRepetirVideo.hidden = true;
        if (elementoVideoIndisponivel) {
            elementoVideoIndisponivel.hidden = false;
        }
        return;
    }

    elementoVideo.hidden = false;
    if (botaoRepetirVideo) botaoRepetirVideo.hidden = false;
    if (elementoVideoIndisponivel) {
        elementoVideoIndisponivel.hidden = true;
    }

    elementoVideo.src =
        nomeDoVideo +
        "?rel=0&modestbranding=1";
}


// ==========================================
// REPETIR TRADUÇÃO
// ==========================================

function repetirTraducao() {
    if (!elementoVideo) {
        return;
    }

    const endereco = elementoVideo.src
        .replace("&autoplay=1", "")
        .replace("?autoplay=1", "");

    elementoVideo.src = "";

    setTimeout(function () {
        elementoVideo.src =
            endereco +
            (endereco.includes("?") ? "&" : "?") +
            "autoplay=1";
    }, 100);
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

    elementoVidas.innerHTML =
        "❤️".repeat(vidas) +
        "<span class=\"somente-leitor\">" +
        vidas +
        " vidas restantes</span>";

    if (elementoSequencia) {
        elementoSequencia.textContent = sequencia;
    }

    const porcentagem =
        (faseAtual /
            perguntas.length) *
        100;

    elementoProgresso.style.width =
        porcentagem + "%";

    if (elementoPorcentagem) {
        elementoPorcentagem.textContent =
            Math.round(porcentagem) + "%";
    }

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

function marcarAlternativas(valorEscolhido, respostaCorreta) {
    const botoes =
        elementoAlternativas.querySelectorAll(
            ".botao-alternativa"
        );

    botoes.forEach(function (botao) {
        const valor = Number(botao.dataset.valor);

        if (valor === respostaCorreta) {
            botao.classList.add("correta");
        } else if (valor === valorEscolhido) {
            botao.classList.add("incorreta");
        } else {
            botao.classList.add("neutra");
        }
    });
}

function configurarControlesDaTela() {
    const botaoVoltar =
        document.getElementById("botaoVoltar");

    const botaoSair =
        document.getElementById("botaoSair");

    if (botaoVoltar) {
        botaoVoltar.addEventListener(
            "click",
            confirmarSaidaDoJogo
        );
    }

    if (botaoSair) {
        botaoSair.addEventListener(
            "click",
            confirmarSaidaDoJogo
        );
    }

    if (botaoDica && areaDica) {
        botaoDica.addEventListener("click", function () {
            const deveAbrir = areaDica.hidden;

            areaDica.hidden = !deveAbrir;
            botaoDica.setAttribute(
                "aria-expanded",
                String(deveAbrir)
            );

            botaoDica.textContent = deveAbrir
                ? "💡 Ocultar dica"
                : "💡 Ver dica";
        });
    }
}

async function confirmarSaidaDoJogo() {
    if (typeof Swal === "undefined") {
        if (confirm("Deseja sair do jogo?")) {
            window.location.href = "radiciacao.html";
        }
        return;
    }

    const resultado = await Swal.fire({
        icon: "warning",
        title: "Sair do jogo?",
        html: conteudoAlertaComLibras(
            "O progresso desta partida ainda não concluída será perdido."
        ),
        showCancelButton: true,
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Continuar jogando",
        confirmButtonColor: "#d94b4b",
        cancelButtonColor: "#1d3557",
        allowOutsideClick: false,
        customClass: {
            popup: "alerta-reforca"
        },
        didOpen: ativarTraducaoDoAlerta,
        willClose: pararTraducaoDoAlerta
    });

    if (resultado.isConfirmed) {
        window.location.href = "radiciacao.html";
    }
}

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