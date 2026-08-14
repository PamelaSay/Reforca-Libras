// ==========================================
// CONFIGURAÇÕES DO CURSO
// ==========================================

const CHAVE_CURSO = "progressoCursoPotenciacao";
const TOTAL_ETAPAS = 4;

let playerVideoaula = null;
let etapaVideoAtual = null;
let apiYouTubePronta = false;
let videoTerminou = false;


// ==========================================
// PROGRESSO INICIAL
// ==========================================

function progressoInicial() {
    return {
        etapaLiberada: 1,
        aulasAssistidas: [],
        concluidas: []
    };
}


// ==========================================
// RECUPERAR PROGRESSO
// ==========================================

function obterProgressoCurso() {
    try {
        const salvo =
            localStorage.getItem(CHAVE_CURSO);

        const progresso = salvo
            ? JSON.parse(salvo)
            : progressoInicial();

        progresso.etapaLiberada =
            Number(progresso.etapaLiberada) || 1;

        progresso.aulasAssistidas =
            Array.isArray(progresso.aulasAssistidas)
                ? progresso.aulasAssistidas.map(Number)
                : [];

        progresso.concluidas =
            Array.isArray(progresso.concluidas)
                ? progresso.concluidas.map(Number)
                : [];

        return progresso;

    } catch (erro) {
        console.error(
            "Erro ao recuperar o progresso:",
            erro
        );

        return progressoInicial();
    }
}


// ==========================================
// SALVAR PROGRESSO
// ==========================================

function salvarProgressoCurso(progresso) {
    localStorage.setItem(
        CHAVE_CURSO,
        JSON.stringify(progresso)
    );
}


// ==========================================
// REGISTRAR VIDEOAULA ASSISTIDA
// ==========================================

function registrarAulaAssistida(numero) {
    const progresso = obterProgressoCurso();

    if (
        !progresso.aulasAssistidas.includes(numero)
    ) {
        progresso.aulasAssistidas.push(numero);

        progresso.aulasAssistidas.sort(
            function (a, b) {
                return a - b;
            }
        );
    }

    salvarProgressoCurso(progresso);
    atualizarCursoNaTela();
}


// ==========================================
// ATUALIZAR OS CARDS
// ==========================================

function atualizarCursoNaTela() {
    const progresso = obterProgressoCurso();

    const cards =
        document.querySelectorAll(".etapa-curso");

    cards.forEach(function (card) {
        const numero =
            Number(card.dataset.etapa);

        const situacao =
            card.querySelector(".situacao");

        const aulaAssistida =
            progresso.aulasAssistidas.includes(numero);

        const concluida =
            progresso.concluidas.includes(numero);

        const liberada =
            numero <= progresso.etapaLiberada;

        card.classList.toggle(
            "bloqueada",
            !liberada
        );

        card.classList.toggle(
            "concluida",
            concluida
        );

        card.classList.toggle(
            "aula-assistida",
            aulaAssistida && !concluida
        );

        if (!situacao) {
            return;
        }

        if (concluida) {
            situacao.textContent =
                "AULA " +
                numero +
                " · CONCLUÍDA ✓";

        } else if (!liberada) {
            situacao.textContent =
                "AULA " +
                numero +
                " · BLOQUEADA";

        } else if (aulaAssistida) {
            situacao.textContent =
                "AULA " +
                numero +
                " · TESTE DISPONÍVEL";

        } else {
            situacao.textContent =
                "AULA " +
                numero +
                " · DISPONÍVEL";
        }
    });

    atualizarBarraCurso(progresso);
}


// ==========================================
// ATUALIZAR BARRA
// ==========================================

function atualizarBarraCurso(progresso) {
    const quantidade =
        progresso.concluidas.length;

    const porcentagem = Math.round(
        (quantidade / TOTAL_ETAPAS) * 100
    );

    const texto =
        document.getElementById(
            "porcentagemCurso"
        );

    const barra =
        document.getElementById(
            "barraCurso"
        );

    const resumo =
        document.getElementById(
            "resumoCurso"
        );

    if (texto) {
        texto.textContent =
            porcentagem + "%";
    }

    if (barra) {
        barra.style.width =
            porcentagem + "%";
    }

    if (resumo) {
        resumo.textContent =
            quantidade +
            " de " +
            TOTAL_ETAPAS +
            " etapas concluídas";
    }
}


// ==========================================
// API DO YOUTUBE PRONTA
// ==========================================

function onYouTubeIframeAPIReady() {
    apiYouTubePronta = true;
}


// ==========================================
// VALIDAR ID DO VÍDEO
// ==========================================

function videoIdValido(videoId) {
    return Boolean(
        videoId &&
        !videoId.startsWith("ID_DO_") &&
        /^[a-zA-Z0-9_-]{11}$/.test(videoId)
    );
}


// ==========================================
// ABRIR VIDEOAULA
// ==========================================

function abrirVideoaula(numero, videoId) {
    const progresso = obterProgressoCurso();

    if (numero > progresso.etapaLiberada) {
        mostrarMensagem(
            "Etapa bloqueada",
            "Conclua o teste anterior para liberar esta videoaula.",
            "warning"
        );

        return;
    }

    if (!videoIdValido(videoId)) {
        mostrarMensagem(
            "Vídeo indisponível",
            "O vídeo desta aula ainda não foi cadastrado.",
            "info"
        );

        return;
    }

    if (
        typeof YT !== "undefined" &&
        YT.Player
    ) {
        apiYouTubePronta = true;
    }

    if (!apiYouTubePronta) {
        mostrarMensagem(
            "Aguarde um instante",
            "O player do vídeo ainda está carregando.",
            "info"
        );

        return;
    }

    const modal =
        document.getElementById(
            "modalVideoaula"
        );

    const titulo =
        document.getElementById(
            "tituloVideoaula"
        );

    if (!modal || !titulo) {
        console.error(
            "O modal da videoaula não foi encontrado."
        );

        return;
    }

    etapaVideoAtual = numero;
    videoTerminou = false;

    titulo.textContent =
        "Aula " +
        numero +
        " — Potenciação";

    modal.classList.add("aberto");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    prepararControlesDoVideo();
    prepararAreaDoPlayer();

    playerVideoaula = new YT.Player(
        "playerVideoaula",
        {
            videoId: videoId,

            playerVars: {
                autoplay: 1,
                rel: 0,
                modestbranding: 1,
                playsinline: 1
            },

            events: {
                onStateChange:
                    verificarEstadoDoVideo,

                onError:
                    tratarErroDoVideo
            }
        }
    );
}


// ==========================================
// PREPARAR CONTROLES
// ==========================================

function prepararControlesDoVideo() {
    const botaoConcluir =
        document.getElementById(
            "concluirVideoaula"
        );

    const aviso =
        document.querySelector(
            ".aviso-videoaula"
        );

    if (botaoConcluir) {
        botaoConcluir.disabled = true;

        botaoConcluir.textContent =
            "Assista até o final para continuar";
    }

    if (aviso) {
        aviso.textContent =
            "Assista ao vídeo até o final para liberar o teste de conhecimento.";
    }
}


// ==========================================
// VERIFICAR FINAL DO VÍDEO
// ==========================================

function verificarEstadoDoVideo(evento) {
    if (
        evento.data !==
        YT.PlayerState.ENDED
    ) {
        return;
    }

    if (etapaVideoAtual === null) {
        return;
    }

    videoTerminou = true;

    const botaoConcluir =
        document.getElementById(
            "concluirVideoaula"
        );

    const aviso =
        document.querySelector(
            ".aviso-videoaula"
        );

    if (botaoConcluir) {
        botaoConcluir.disabled = false;

        botaoConcluir.textContent =
            "✓ Concluir aula e fazer verificação";

        botaoConcluir.focus();
    }

    if (aviso) {
        aviso.textContent =
            "Videoaula assistida! Clique em concluir para abrir a verificação.";
    }
}


// ==========================================
// CONCLUIR VIDEOAULA
// ==========================================

function concluirVideoaula() {
    if (
        !videoTerminou ||
        etapaVideoAtual === null
    ) {
        mostrarMensagem(
            "Aula ainda não concluída",
            "Assista ao vídeo até o final.",
            "warning"
        );

        return;
    }

    const etapaConcluida =
        etapaVideoAtual;

    const teste =
        document.querySelector(
            '.etapa-curso[data-etapa="' +
            etapaConcluida +
            '"] .btn-jogo'
        );

    registrarAulaAssistida(
        etapaConcluida
    );

    fecharModalVideoaula();

    mostrarMensagem(
        "Videoaula concluída!",
        "A verificação foi liberada.",
        "success"
    ).then(function () {
        if (teste) {
            teste.click();
        }
    });
}


// ==========================================
// ERRO DO YOUTUBE
// ==========================================

function tratarErroDoVideo(evento) {
    console.error(
        "Erro do YouTube:",
        evento.data
    );

    fecharModalVideoaula();

    mostrarMensagem(
        "Não foi possível abrir o vídeo",
        "Confira se o vídeo permite reprodução em outros sites.",
        "error"
    );
}


// ==========================================
// RECRIAR ÁREA DO PLAYER
// ==========================================

function prepararAreaDoPlayer() {
    if (playerVideoaula) {
        try {
            playerVideoaula.destroy();
        } catch (erro) {
            console.warn(
                "O player anterior já estava fechado."
            );
        }
    }

    playerVideoaula = null;

    const area =
        document.querySelector(
            ".videoaula-player"
        );

    if (area) {
        area.innerHTML =
            '<div id="playerVideoaula"></div>';
    }
}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModalVideoaula() {
    const modal =
        document.getElementById(
            "modalVideoaula"
        );

    if (modal) {
        modal.classList.remove("aberto");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    document.body.style.overflow = "";

    prepararAreaDoPlayer();

    etapaVideoAtual = null;
    videoTerminou = false;
}


// ==========================================
// ABRIR TESTE
// ==========================================

function abrirTeste(numero, destino) {
    const progresso =
        obterProgressoCurso();

    if (
        numero >
        progresso.etapaLiberada
    ) {
        mostrarMensagem(
            "Etapa bloqueada",
            "Conclua o teste anterior para liberar esta etapa.",
            "warning"
        );

        return;
    }

    if (
        !progresso.aulasAssistidas.includes(
            numero
        )
    ) {
        mostrarMensagem(
            "Assista primeiro à aula",
            "O teste será liberado quando o vídeo terminar.",
            "warning"
        );

        return;
    }

    if (
        !destino ||
        destino === "#" ||
        destino.includes("youtube.com") ||
        destino.includes("youtu.be")
    ) {
        mostrarMensagem(
            "Teste indisponível",
            "O jogo desta etapa ainda não foi cadastrado.",
            "info"
        );

        return;
    }

    sessionStorage.setItem(
        "testeCursoAtual",
        String(numero)
    );

    window.location.href =
        destino;
}


// ==========================================
// CONFIGURAR LINKS
// ==========================================

function configurarLinksDoCurso() {
    const links =
        document.querySelectorAll(
            ".etapa-curso a[data-acao]"
        );

    links.forEach(function (link) {
        link.addEventListener(
            "click",
            function (evento) {
                evento.preventDefault();

                const card =
                    link.closest(
                        ".etapa-curso"
                    );

                if (!card) {
                    return;
                }

                const numero =
                    Number(
                        card.dataset.etapa
                    );

                const tipo =
                    link.dataset.acao;

                if (tipo === "aula") {
                    abrirVideoaula(
                        numero,
                        link.dataset.videoId || ""
                    );
                }

                if (tipo === "teste") {
                    abrirTeste(
                        numero,
                        link.getAttribute("href")
                    );
                }
            }
        );
    });
}


// ==========================================
// CRIAR BOTÕES DO MODAL
// ==========================================

function criarControlesDoModal() {
    const caixa =
        document.querySelector(
            ".videoaula-box"
        );

    if (!caixa) {
        return;
    }

    if (
        document.getElementById(
            "concluirVideoaula"
        )
    ) {
        return;
    }

    const controles =
        document.createElement("div");

    controles.className =
        "videoaula-acoes";

    controles.innerHTML = `
        <button
            type="button"
            class="cancelar-videoaula"
        >
            Fechar e continuar depois
        </button>

        <button
            type="button"
            id="concluirVideoaula"
            disabled
        >
            Assista até o final para continuar
        </button>
    `;

    caixa.appendChild(controles);

    const cancelar =
        controles.querySelector(
            ".cancelar-videoaula"
        );

    const concluir =
        controles.querySelector(
            "#concluirVideoaula"
        );

    cancelar.addEventListener(
        "click",
        fecharModalVideoaula
    );

    concluir.addEventListener(
        "click",
        concluirVideoaula
    );
}


// ==========================================
// REGISTRAR TESTE CONCLUÍDO
// ==========================================

function concluirEtapaPotenciacao(numero) {
    numero = Number(numero);

    if (
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > TOTAL_ETAPAS
    ) {
        return;
    }

    const progresso =
        obterProgressoCurso();

    if (
        !progresso.concluidas.includes(
            numero
        )
    ) {
        progresso.concluidas.push(
            numero
        );

        progresso.concluidas.sort(
            function (a, b) {
                return a - b;
            }
        );
    }

    progresso.etapaLiberada =
        Math.min(
            TOTAL_ETAPAS,
            Math.max(
                progresso.etapaLiberada,
                numero + 1
            )
        );

    salvarProgressoCurso(progresso);
    atualizarCursoNaTela();
}


// ==========================================
// ALERTAS
// ==========================================

function mostrarMensagem(
    titulo,
    texto,
    icone
) {
    if (
        typeof Swal !== "undefined"
    ) {
        return Swal.fire({
            icon: icone,
            title: titulo,
            text: texto,
            confirmButtonColor:
                "#1d3557",
            confirmButtonText:
                "OK"
        });
    }

    alert(
        titulo +
        "\n\n" +
        texto
    );

    return Promise.resolve();
}


// ==========================================
// BOTÃO VOLTAR
// ==========================================

function voltarPagina() {
    if (
        document.referrer &&
        document.referrer !==
        window.location.href
    ) {
        window.history.back();

        return;
    }

    window.location.href =
        "matematica.html";
}


// ==========================================
// INICIAR PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        criarControlesDoModal();
        atualizarCursoNaTela();
        configurarLinksDoCurso();

        const fechar =
            document.getElementById(
                "fecharVideoaula"
            );

        const modal =
            document.getElementById(
                "modalVideoaula"
            );

        if (fechar) {
            fechar.addEventListener(
                "click",
                fecharModalVideoaula
            );
        }

        if (modal) {
            modal.addEventListener(
                "click",
                function (evento) {
                    if (
                        evento.target === modal
                    ) {
                        fecharModalVideoaula();
                    }
                }
            );
        }

        document.addEventListener(
            "keydown",
            function (evento) {
                if (
                    evento.key === "Escape" &&
                    modal &&
                    modal.classList.contains(
                        "aberto"
                    )
                ) {
                    fecharModalVideoaula();
                }
            }
        );
    }
);