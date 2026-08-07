// ==========================================
// CONFIGURAÇÃO DE COMENTÁRIOS COM FIREBASE
// ==========================================

let notaSelecionada = 0;

const palavrasProibidas = [
    "idiota", "burro", "otario", "otário", "bosta", 
    "merda", "fdp", "desgraçado", "desgracado", "imbecil", "lixo"
];

// 1. Pega o nome do usuário logado
function obterNomeUsuarioLogado() {
    const dados = localStorage.getItem("usuarioLogado") || 
                  localStorage.getItem("usuarioCadastrado") || 
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

// 2. Atualiza a aparência das estrelas
function atualizarEstrelas(nota) {
    const estrelas = document.querySelectorAll(".estrela");
    
    estrelas.forEach((e) => {
        const valorEstrela = Number(e.dataset.nota || e.dataset.valor || e.getAttribute("data-nota") || 0);
        
        if (valorEstrela <= Number(nota) && Number(nota) > 0) {
            e.classList.add("ativa");
            e.style.color = "#FFD700"; // Cor dourada
        } else {
            e.classList.remove("ativa");
            e.style.color = "#ccc"; // Cor cinza
        }
    });
}

// 3. Ativa o clique nas estrelas
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

// 4. Salva comentário no Firestore
function salvarComentario() {
    const textarea = document.getElementById("comentario");
    if (!textarea) return;

    const texto = textarea.value.trim();

    if (notaSelecionada === 0) {
        exibirMensagem('warning', 'Atenção', 'Por favor, selecione de 1 a 5 estrelas para avaliar.');
        return;
    }

    if (texto === "") {
        exibirMensagem('warning', 'Atenção', 'Escreva um comentário antes de enviar.');
        return;
    }

    const comentarioMinusculo = texto.toLowerCase();
    for (let palavra of palavrasProibidas) {
        if (comentarioMinusculo.includes(palavra)) {
            exibirMensagem('error', 'Atenção', 'Seu comentário contém termos inadequados.');
            return;
        }
    }

    const nomeAutor = obterNomeUsuarioLogado();

    const novoComentario = {
        nome: nomeAutor,
        nota: notaSelecionada,
        texto: texto,
        dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (typeof db !== 'undefined') {
        db.collection("comentarios").add(novoComentario)
            .then(() => {
                textarea.value = "";
                notaSelecionada = 0;
                atualizarEstrelas(0);

                exibirMensagem('success', 'Obrigado!', 'Sua avaliação foi enviada com sucesso!');
            })
            .catch((error) => {
                console.error("Erro ao salvar comentário no Firebase:", error);
                exibirMensagem('error', 'Erro', 'Falha ao enviar comentário. Tente novamente!');
            });
    } else {
        exibirMensagem('error', 'Erro', 'Conexão com o banco de dados não encontrada.');
    }
}

// 5. Ouvinte em tempo real para carregar os comentários
function escutarComentariosFirebase() {
    if (typeof db === 'undefined') return;

    db.collection("comentarios")
        .orderBy("dataCriacao", "desc")
        .onSnapshot((snapshot) => {
            const comentarios = [];

            snapshot.forEach((doc) => {
                const dados = doc.data();

                let dataFormatada = "Recente";
                if (dados.dataCriacao && dados.dataCriacao.toDate) {
                    dataFormatada = dados.dataCriacao.toDate().toLocaleDateString("pt-BR");
                }

                comentarios.push({
                    nome: dados.nome || "Anônimo",
                    nota: dados.nota || 5,
                    texto: dados.texto || "",
                    data: dataFormatada
                });
            });

            renderizarUltimosComentarios(comentarios);
            renderizarTodosComentarios(comentarios);
        }, (error) => {
            console.error("Erro ao carregar comentários do Firebase:", error);
        });
}

// Renderiza últimos comentários (se o elemento existir na tela)
function renderizarUltimosComentarios(comentarios) {
    const lista = document.getElementById("ultimos-comentarios");
    if (!lista) return;

    lista.innerHTML = "";

    if (!comentarios || comentarios.length === 0) {
        lista.innerHTML = "<p style='text-align: center; width: 100%;'>Nenhuma avaliação ainda.</p>";
        return;
    }

    let htmlFinal = "";

    comentarios.slice(0, 4).forEach((comentario) => {
        const notaValidada = Math.max(1, Math.min(5, Number(comentario.nota) || 5));
        const estrelas = "⭐".repeat(notaValidada);
        const nome = sanitarizarTexto(comentario.nome);
        const texto = sanitarizarTexto(comentario.texto);

        htmlFinal += `
            <div class="comentario-card">
                <div class="comentario-estrelas">${estrelas}</div>
                <strong>${nome}</strong>
                <p>${texto}</p>
            </div>
        `;
    });

    lista.innerHTML = htmlFinal;
}

// Renderiza a lista completa de comentários
function renderizarTodosComentarios(comentarios) {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    lista.innerHTML = "";

    if (!comentarios || comentarios.length === 0) {
        lista.innerHTML = "<p style='text-align: center; width: 100%;'>Nenhum comentário cadastrado ainda.</p>";
        return;
    }

    let htmlFinal = "";

    comentarios.forEach((comentario) => {
        const notaValidada = Math.max(1, Math.min(5, Number(comentario.nota) || 5));
        const estrelas = "⭐".repeat(notaValidada);
        const nome = sanitarizarTexto(comentario.nome);
        const texto = sanitarizarTexto(comentario.texto);
        const data = comentario.data || "Recente";

        htmlFinal += `
            <div class="comentario-card">
                <div class="comentario-topo">
                    <strong>${nome}</strong>
                    <span>${data}</span>
                </div>
                <div class="comentario-estrelas">${estrelas}</div>
                <p>${texto}</p>
            </div>
        `;
    });

    lista.innerHTML = htmlFinal;
}

// Funções auxiliares
function exibirMensagem(icon, title, text) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            timer: icon === 'success' ? 1800 : null,
            showConfirmButton: icon !== 'success'
        });
    } else {
        alert(`${title}: ${text}`);
    }
}

function sanitarizarTexto(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// 6. Inicialização
function inicializar() {
    configurarEstrelas();
    escutarComentariosFirebase();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}
