// ==========================================
// CONFIGURAÇÃO DO CURSO
// ==========================================

const CHAVE_CURSO = "progressoCursoPotenciacao";
const TOTAL_ETAPAS = 4;
let playerVideoaula = null;
let etapaVideoAtual = null;
let apiYouTubePronta = false;
let videoConcluido = false;

// ==========================================
// OBTER PROGRESSO SALVO
// ==========================================

function obterProgressoCurso() {
    try {
        const progressoSalvo =
            localStorage.getItem(CHAVE_CURSO);

        if (progressoSalvo) {
            return JSON.parse(progressoSalvo);
        }
    } catch (erro) {
        console.error(
            "Erro ao recuperar progresso:",
            erro
        );
    }

    return {
        etapaLiberada: 1,
        concluidas: []
    };
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
// ATUALIZAR CARDS NA TELA
// ==========================================

function atualizarCursoNaTela() {
    const progresso = obterProgressoCurso();

    const etapas =
        document.querySelectorAll(".etapa-curso");

    etapas.forEach(function (card) {
        const numero =
            Number(card.dataset.etapa);

        const situacao =
            card.querySelector(".situacao");

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

        if (situacao) {
            if (concluida) {
                situacao.textContent =
                    "AULA " +
                    numero +
                    " · CONCLUÍDA ✓";

            } else if (liberada) {
                situacao.textContent =
                    "AULA " +
                    numero +
                    " · DISPONÍVEL";

            } else {
                situacao.textContent =
                    "AULA " +
                    numero +
                    " · BLOQUEADA";
            }
        }
    });

    atualizarBarraCurso(progresso);
}


// ==========================================
// ATUALIZAR BARRA DE PROGRESSO
// ==========================================

function atualizarBarraCurso(progresso) {
    const quantidadeConcluida =
        progresso.concluidas.length;

    const porcentagem =
        Math.round(
            (quantidadeConcluida / TOTAL_ETAPAS) *
            100
        );

    const textoPorcentagem =
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

    const botaoContinuar =
        document.getElementById(
            "btnContinuar"
        );

    if (textoPorcentagem) {
        textoPorcentagem.textContent =
            porcentagem + "%";
    }

    if (barra) {
        barra.style.width =
            porcentagem + "%";
    }

    if (resumo) {
        resumo.textContent =
            quantidadeConcluida +
            " de " +
            TOTAL_ETAPAS +
            " etapas concluídas";
    }

    if (botaoContinuar) {
        if (
            quantidadeConcluida ===
            TOTAL_ETAPAS
        ) {
            botaoContinuar.textContent =
                "✓ Curso concluído";

        } else if (quantidadeConcluida > 0) {
            botaoContinuar.textContent =
                "▶ Continuar curso";

        } else {
            botaoContinuar.textContent =
                "▶ Começar curso";
        }
    }
}


// ==========================================
// ABRIR AULA OU TESTE
// ==========================================

function abrirEtapa(
    numero,
    tipo,
    destino
) {
    const progresso = obterProgressoCurso();

    if (numero > progresso.etapaLiberada) {
        alert(
            "Conclua o teste da etapa anterior " +
            "para liberar esta aula."
        );

        return;
    }

    if (tipo === "teste") {
        sessionStorage.setItem(
            "testeCursoAtual",
            String(numero)
        );
    }

    window.location.href = destino;
}


// ==========================================
// CONTROLAR CLIQUES NOS CARDS
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
                    link.closest(".etapa-curso");

               if (tipo === "aula") {
    const videoId =
        link.dataset.videoId;

    abrirVideoaula(
        numero,
        videoId
    );
}

if (tipo === "teste") {
    abrirTeste(
        numero,
        destino
    );
}

                const numero =
                    Number(card.dataset.etapa);

                const tipo =
                    link.dataset.acao;

                const destino =
                    link.getAttribute("href");

                abrirEtapa(
                    numero,
                    tipo,
                    destino
                );
            }
        );
    });
}


// ==========================================
// BOTÃO COMEÇAR OU CONTINUAR
// ==========================================

function configurarBotaoContinuar() {
    const botao =
        document.getElementById(
            "btnContinuar"
        );

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        function () {
            const progresso =
                obterProgressoCurso();

            if (
                progresso.concluidas.length ===
                TOTAL_ETAPAS
            ) {
                alert(
                    "Parabéns! Você concluiu " +
                    "todas as etapas."
                );

                return;
            }

            const etapa =
                Math.min(
                    progresso.etapaLiberada,
                    TOTAL_ETAPAS
                );

            const link =
                document.querySelector(
                    '.etapa-curso[data-etapa="' +
                    etapa +
                    '"] .btn-aula'
                );

            if (link) {
                window.location.href =
                    link.getAttribute("href");
            }
        }
    );
}


// ==========================================
// CONCLUIR UMA ETAPA
// ==========================================

function concluirEtapaPotenciacao(numero) {
    const progresso = obterProgressoCurso();

    if (
        !progresso.concluidas.includes(numero)
    ) {
        progresso.concluidas.push(numero);
    }

    if (numero < TOTAL_ETAPAS) {
        progresso.etapaLiberada =
            Math.max(
                progresso.etapaLiberada,
                numero + 1
            );
    }

    progresso.concluidas.sort(
        function (primeiro, segundo) {
            return primeiro - segundo;
        }
    );

    salvarProgressoCurso(progresso);
    atualizarCursoNaTela();
}


// ==========================================
// REINICIAR CURSO — PARA TESTES
// ==========================================

function reiniciarCursoPotenciacao() {
    const confirmar = confirm(
        "Deseja apagar o progresso deste curso?"
    );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(CHAVE_CURSO);

    atualizarCursoNaTela();

    window.location.reload();
}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        atualizarCursoNaTela();
        configurarLinksDoCurso();

        const botaoFecharVideo =
            document.getElementById(
                "fecharVideoaula"
            );

        const modalVideo =
            document.getElementById(
                "modalVideoaula"
            );

        if (botaoFecharVideo) {
            botaoFecharVideo.addEventListener(
                "click",
                fecharModalVideoaula
            );
        }

        if (modalVideo) {
            modalVideo.addEventListener(
                "click",
                function (evento) {
                    if (evento.target === modalVideo) {
                        fecharModalVideoaula();
                    }
                }
            );
        }
    }
);

// ==========================================
// API DO YOUTUBE CARREGADA
// ==========================================

function onYouTubeIframeAPIReady() {
    apiYouTubePronta = true;
}


// ==========================================
// ABRIR VIDEOAULA NO MODAL
// ==========================================

function abrirVideoaula(numero, videoId) {
    const progresso = obterProgressoCurso();

    if (numero > progresso.etapaLiberada) {
        alert(
            "Conclua o teste da etapa anterior " +
            "para liberar esta videoaula."
        );

        return;
    }

    if (!videoId) {
        alert(
            "O vídeo desta aula ainda não foi cadastrado."
        );

        return;
    }

    if (
        !apiYouTubePronta ||
        typeof YT === "undefined" ||
        !YT.Player
    ) {
        alert(
            "O vídeo ainda está carregando. " +
            "Aguarde um instante e tente novamente."
        );

        return;
    }

    etapaVideoAtual = numero;
    videoConcluido = false;

    const modal =
        document.getElementById("modalVideoaula");

    const titulo =
        document.getElementById("tituloVideoaula");

    titulo.textContent =
        "Aula " + numero + " — Potenciação";

    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    if (playerVideoaula) {
        playerVideoaula.destroy();
        playerVideoaula = null;
    }

    playerVideoaula = new YT.Player(
        "playerVideoaula",
        {
            videoId: videoId,

            playerVars: {
                autoplay: 1,
                rel: 0,
                modestbranding: 1
            },

            events: {
                onStateChange:
                    verificarEstadoDoVideo
            }
        }
    );
}


// ==========================================
// VERIFICAR SE O VÍDEO TERMINOU
// ==========================================

function verificarEstadoDoVideo(evento) {
    if (
        evento.data === YT.PlayerState.ENDED
    ) {
        videoConcluido = true;

        registrarAulaAssistida(
            etapaVideoAtual
        );

        fecharModalVideoaula();

        mostrarAvisoAulaConcluida();
    }
}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModalVideoaula() {
    const modal =
        document.getElementById("modalVideoaula");

    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (playerVideoaula) {
        playerVideoaula.destroy();
        playerVideoaula = null;
    }

    etapaVideoAtual = null;
}


// ==========================================
// MENSAGEM APÓS O VÍDEO
// ==========================================

function mostrarAvisoAulaConcluida() {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "success",
            title: "Videoaula concluída!",
            text:
                "O teste de conhecimento " +
                "desta etapa foi liberado.",
            confirmButtonText: "Fazer o teste",
            confirmButtonColor: "#1d3557"
        }).then(function () {
            localizarTesteDisponivel();
        });

        return;
    }

    alert(
        "Videoaula concluída! " +
        "O teste foi liberado."
    );

    localizarTesteDisponivel();
}


// ==========================================
// MOSTRAR O TESTE LIBERADO
// ==========================================

function localizarTesteDisponivel() {
    if (!videoConcluido) {
        return;
    }

    const card = document.querySelector(
        '.etapa-curso[data-etapa="' +
        obterUltimaAulaAssistida() +
        '"]'
    );

    if (card) {
        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}


function obterUltimaAulaAssistida() {
    const progresso = obterProgressoCurso();

    if (progresso.aulasAssistidas.length === 0) {
        return 1;
    }

    return Math.max(
        ...progresso.aulasAssistidas
    );
};