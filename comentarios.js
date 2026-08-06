// ===== COMENTÁRIOS =====

// Nota inicial zero (todas apagadas)
let notaSelecionada = 0;

const palavrasProibidas = [
    "idiota", "burro", "otario", "otário", "bosta", 
    "merda", "fdp", "desgraçado", "desgracado", "imbecil", "lixo"
];

// 1. Pega o nome do usuário logado e trata se for e-mail
function obterNomeUsuarioLogado() {
    const dados = localStorage.getItem("usuarioLogado") || 
                  localStorage.getItem("usuario") || 
                  localStorage.getItem("user");

    if (!dados) return "Aluno";

    let nomeEncontrado = "";
    try {
        const obj = JSON.parse(dados);
        nomeEncontrado = obj.nome || obj.name || obj.displayName || "";
    } catch (e) {
        nomeEncontrado = dados;
    }

    if (nomeEncontrado && typeof nomeEncontrado === "string") {
        if (nomeEncontrado.includes("@")) {
            nomeEncontrado = nomeEncontrado.split("@")[0];
        }
        return nomeEncontrado.charAt(0).toUpperCase() + nomeEncontrado.slice(1);
    }

    return "Aluno";
}

// 2. Função que pinta e apaga as estrelas na tela
function atualizarEstrelas(nota) {
    const estrelas = document.querySelectorAll(".estrela");
    
    estrelas.forEach((e) => {
        // Aceita data-nota ou data-valor do HTML
        const valorEstrela = Number(e.dataset.nota || e.dataset.valor || e.getAttribute("data-nota") || 0);
        
        if (valorEstrela <= Number(nota) && Number(nota) > 0) {
            e.classList.add("ativa");
            e.style.color = "#FFD700"; // Força a cor dourada via estilo inline
        } else {
            e.classList.remove("ativa");
            e.style.color = "#ccc"; // Força a cor cinza via estilo inline
        }
    });
}

// 3. Ativa o clique em cada estrela
function configurarEstrelas() {
    const estrelas = document.querySelectorAll(".estrela");

    estrelas.forEach((estrela) => {
        estrela.onclick = function() {
            const valor = Number(this.dataset.nota || this.dataset.valor || this.getAttribute("data-nota") || 0);
            notaSelecionada = valor;
            atualizarEstrelas(notaSelecionada);
        };
    });

    atualizarEstrelas(notaSelecionada);
}

// 4. Salvar comentário no localStorage
function salvarComentario() {
    const textarea = document.getElementById("comentario");
    if (!textarea) return;

    const texto = textarea.value.trim();

    if (notaSelecionada === 0) {
        alert("Por favor, clique em uma das estrelas para avaliar.");
        return;
    }

    if (texto === "") {
        alert("Escreva um comentário antes de enviar.");
        return;
    }

    const comentarioMinusculo = texto.toLowerCase();
    for (let palavra of palavrasProibidas) {
        if (comentarioMinusculo.includes(palavra)) {
            alert("Seu comentário possui palavras inadequadas.");
            return;
        }
    }

    const nomeAutor = obterNomeUsuarioLogado();

    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    comentarios.unshift({
        nome: nomeAutor,
        nota: notaSelecionada,
        texto: texto,
        data: new Date().toLocaleDateString("pt-BR")
    });

    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    textarea.value = "";
    notaSelecionada = 0;
    atualizarEstrelas(0);

    carregarComentarios();
    carregarUltimosComentarios();

    alert("Obrigado pela sua avaliação!");
}

// 5. Exibe os 4 últimos comentários
function carregarUltimosComentarios() {
    const lista = document.getElementById("ultimos-comentarios");
    if (!lista) return;

    lista.innerHTML = "";
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    if (comentarios.length === 0) {
        lista.innerHTML = "<p style='color: white; text-align: center; width: 100%;'>Nenhuma avaliação ainda.</p>";
        return;
    }

    comentarios.slice(0, 4).forEach((comentario) => {
        lista.innerHTML += `
            <div class="comentario-card">
                <div class="comentario-estrelas">
                    ${"⭐".repeat(comentario.nota)}
                </div>
                <strong>${comentario.nome}</strong>
                <p>${comentario.texto}</p>
            </div>
        `;
    });
}

// 6. Exibe todos os comentários
function carregarComentarios() {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    lista.innerHTML = "";
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    if (comentarios.length === 0) {
        lista.innerHTML = "<p style='color: white; text-align: center; width: 100%;'>Nenhum comentário cadastrado ainda.</p>";
        return;
    }

    comentarios.forEach((comentario) => {
        lista.innerHTML += `
            <div class="comentario-card">
                <div class="comentario-topo">
                    <strong>${comentario.nome}</strong>
                    <span>${comentario.data}</span>
                </div>
                <div class="comentario-estrelas">
                    ${"⭐".repeat(comentario.nota)}
                </div>
                <p>${comentario.texto}</p>
            </div>
        `;
    });
}

// 7. Inicialização segura (Garante a execução mesmo se a página já tiver carregado)
function inicializar() {
    configurarEstrelas();
    carregarComentarios();
    carregarUltimosComentarios();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}