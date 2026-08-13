const CHAVE_CURSO = "progressoCursoPotenciacao";
const TOTAL_ETAPAS = 4;

let playerVideoaula = null;
let etapaVideoAtual = null;
let apiYouTubePronta = false;

function progressoInicial() {
    return { etapaLiberada: 1, aulasAssistidas: [], concluidas: [] };
}

function obterProgressoCurso() {
    try {
        const salvo = localStorage.getItem(CHAVE_CURSO);
        const progresso = salvo ? JSON.parse(salvo) : progressoInicial();

        progresso.etapaLiberada = Number(progresso.etapaLiberada) || 1;
        progresso.aulasAssistidas = Array.isArray(progresso.aulasAssistidas)
            ? progresso.aulasAssistidas.map(Number) : [];
        progresso.concluidas = Array.isArray(progresso.concluidas)
            ? progresso.concluidas.map(Number) : [];

        return progresso;
    } catch (erro) {
        console.error("Erro ao recuperar o progresso:", erro);
        return progressoInicial();
    }
}

function salvarProgressoCurso(progresso) {
    localStorage.setItem(CHAVE_CURSO, JSON.stringify(progresso));
}

function registrarAulaAssistida(numero) {
    const progresso = obterProgressoCurso();

    if (!progresso.aulasAssistidas.includes(numero)) {
        progresso.aulasAssistidas.push(numero);
        progresso.aulasAssistidas.sort((a, b) => a - b);
    }

    salvarProgressoCurso(progresso);
    atualizarCursoNaTela();
}

function atualizarCursoNaTela() {
    const progresso = obterProgressoCurso();

    document.querySelectorAll(".etapa-curso").forEach(function (card) {
        const numero = Number(card.dataset.etapa);
        const situacao = card.querySelector(".situacao");
        const aulaAssistida = progresso.aulasAssistidas.includes(numero);
        const concluida = progresso.concluidas.includes(numero);
        const liberada = numero <= progresso.etapaLiberada;

        card.classList.toggle("bloqueada", !liberada);
        card.classList.toggle("concluida", concluida);
        card.classList.toggle("aula-assistida", aulaAssistida && !concluida);

        if (!situacao) return;

        if (concluida) situacao.textContent = `AULA ${numero} · CONCLUÍDA ✓`;
        else if (!liberada) situacao.textContent = `AULA ${numero} · BLOQUEADA`;
        else if (aulaAssistida) situacao.textContent = `AULA ${numero} · TESTE DISPONÍVEL`;
        else situacao.textContent = `AULA ${numero} · DISPONÍVEL`;
    });

    atualizarBarraCurso(progresso);
}

function atualizarBarraCurso(progresso) {
    const quantidade = progresso.concluidas.length;
    const porcentagem = Math.round((quantidade / TOTAL_ETAPAS) * 100);
    const texto = document.getElementById("porcentagemCurso");
    const barra = document.getElementById("barraCurso");
    const resumo = document.getElementById("resumoCurso");

    if (texto) texto.textContent = `${porcentagem}%`;
    if (barra) barra.style.width = `${porcentagem}%`;
    if (resumo) resumo.textContent = `${quantidade} de ${TOTAL_ETAPAS} etapas concluídas`;
}

// Esta função é chamada automaticamente pela API do YouTube.
function onYouTubeIframeAPIReady() {
    apiYouTubePronta = true;
}

function videoIdValido(videoId) {
    return Boolean(videoId && !videoId.startsWith("ID_DO_") && /^[a-zA-Z0-9_-]{11}$/.test(videoId));
}

function abrirVideoaula(numero, videoId) {
    const progresso = obterProgressoCurso();

    if (numero > progresso.etapaLiberada) {
        mostrarMensagem("Etapa bloqueada", "Conclua o teste anterior para liberar esta videoaula.", "warning");
        return;
    }

    if (!videoIdValido(videoId)) {
        mostrarMensagem("Vídeo indisponível", "O vídeo desta aula ainda não foi cadastrado.", "info");
        return;
    }

    if (typeof YT !== "undefined" && YT.Player) {
        apiYouTubePronta = true;
    }

    if (!apiYouTubePronta) {
        mostrarMensagem("Aguarde um instante", "O player do vídeo ainda está carregando.", "info");
        return;
    }

    const modal = document.getElementById("modalVideoaula");
    const titulo = document.getElementById("tituloVideoaula");
    if (!modal || !titulo) return;

    etapaVideoAtual = numero;
    titulo.textContent = `Aula ${numero} — Potenciação`;
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    prepararAreaDoPlayer();

    playerVideoaula = new YT.Player("playerVideoaula", {
        videoId: videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
            onStateChange: verificarEstadoDoVideo,
            onError: function () {
                fecharModalVideoaula();
                mostrarMensagem("Não foi possível abrir", "Confira se o vídeo permite reprodução fora do YouTube.", "error");
            }
        }
    });
}

function verificarEstadoDoVideo(evento) {
    if (evento.data !== YT.PlayerState.ENDED || etapaVideoAtual === null) return;

    const etapaConcluida = etapaVideoAtual;
    registrarAulaAssistida(etapaConcluida);
    fecharModalVideoaula();

    const teste = document.querySelector(
        `.etapa-curso[data-etapa="${etapaConcluida}"] .btn-jogo`
    );

    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: "success",
            title: "Videoaula concluída!",
            text: "O teste de conhecimento foi liberado.",
            showCancelButton: true,
            confirmButtonText: "Fazer verificação agora",
            cancelButtonText: "Fazer depois",
            confirmButtonColor: "#1d3557"
        }).then(function (resultado) {
            if (resultado.isConfirmed && teste) teste.click();
            else if (teste) teste.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    } else {
        alert("Videoaula concluída! O teste foi liberado.");
        if (teste) teste.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function prepararAreaDoPlayer() {
    if (playerVideoaula) {
        try {
            playerVideoaula.destroy();
        } catch (erro) {
            console.warn("Não foi necessário destruir o player anterior.", erro);
        }
    }

    playerVideoaula = null;

    const area = document.querySelector(".videoaula-player");
    if (area) area.innerHTML = '<div id="playerVideoaula"></div>';
}

function fecharModalVideoaula() {
    const modal = document.getElementById("modalVideoaula");
    if (modal) {
        modal.classList.remove("aberto");
        modal.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";
    prepararAreaDoPlayer();
    etapaVideoAtual = null;
}

function abrirTeste(numero, destino) {
    const progresso = obterProgressoCurso();

    if (numero > progresso.etapaLiberada) {
        mostrarMensagem("Etapa bloqueada", "Conclua o teste anterior para liberar esta etapa.", "warning");
        return;
    }

    if (!progresso.aulasAssistidas.includes(numero)) {
        mostrarMensagem("Assista primeiro à aula", "O teste será liberado quando o vídeo terminar.", "warning");
        return;
    }

    if (!destino || destino === "#" || destino.includes("youtube.com") || destino.includes("youtu.be")) {
        mostrarMensagem("Teste indisponível", "O jogo desta etapa ainda não foi cadastrado.", "info");
        return;
    }

    sessionStorage.setItem("testeCursoAtual", String(numero));
    window.location.href = destino;
}

function configurarLinksDoCurso() {
    document.querySelectorAll(".etapa-curso a[data-acao]").forEach(function (link) {
        link.addEventListener("click", function (evento) {
            evento.preventDefault();
            const card = link.closest(".etapa-curso");
            if (!card) return;

            const numero = Number(card.dataset.etapa);
            const tipo = link.dataset.acao;

            if (tipo === "aula") abrirVideoaula(numero, link.dataset.videoId || "");
            else if (tipo === "teste") abrirTeste(numero, link.getAttribute("href"));
        });
    });
}

// O jogo chama esta função ao terminar o teste com sucesso.
function concluirEtapaPotenciacao(numero) {
    numero = Number(numero);
    if (!Number.isInteger(numero) || numero < 1 || numero > TOTAL_ETAPAS) return;

    const progresso = obterProgressoCurso();
    if (!progresso.concluidas.includes(numero)) {
        progresso.concluidas.push(numero);
        progresso.concluidas.sort((a, b) => a - b);
    }

    progresso.etapaLiberada = Math.min(
        TOTAL_ETAPAS,
        Math.max(progresso.etapaLiberada, numero + 1)
    );

    salvarProgressoCurso(progresso);
    atualizarCursoNaTela();
}

function mostrarMensagem(titulo, texto, icone) {
    if (typeof Swal !== "undefined") {
        return Swal.fire({
            icon: icone,
            title: titulo,
            text: texto,
            confirmButtonColor: "#1d3557",
            confirmButtonText: "OK"
        });
    }

    alert(`${titulo}\n\n${texto}`);
    return Promise.resolve();
}

function reiniciarCursoPotenciacao() {
    if (!confirm("Deseja apagar o progresso deste curso?")) return;
    localStorage.removeItem(CHAVE_CURSO);
    sessionStorage.removeItem("testeCursoAtual");
    window.location.reload();
}

function voltarPagina() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
        return;
    }

    // Altere este endereço se sua página de Matemática estiver em outra pasta.
    window.location.href = "matematica.html";
}

document.addEventListener("DOMContentLoaded", function () {
    atualizarCursoNaTela();
    configurarLinksDoCurso();

    const fechar = document.getElementById("fecharVideoaula");
    const modal = document.getElementById("modalVideoaula");

    if (fechar) fechar.addEventListener("click", fecharModalVideoaula);
    if (modal) {
        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) fecharModalVideoaula();
        });
    }

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && modal && modal.classList.contains("aberto")) {
            fecharModalVideoaula();
        }
    });
});