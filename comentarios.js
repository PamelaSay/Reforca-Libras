// ==========================================
// CONFIGURAÇÃO DE COMENTÁRIOS COM FIREBASE
// ==========================================

// Nota inicial zero (todas apagadas)
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

// 2. Função que pinta e apaga as estrelas na tela
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

// 4. Salvar comentário no FIREBASE FIRESTORE
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

    // Objeto do comentário para enviar ao Firebase
    const novoComentario = {
        usuarioId:
            typeof auth !== "undefined" && auth && auth.currentUser
                ? auth.currentUser.uid
                : null,
        nome: nomeAutor,
        nota: notaSelecionada,
        texto: texto,
        dataCriacao: firebase.firestore.FieldValue.serverTimestamp() // Pega a data/hora oficial do servidor
    };

    // Salva no banco de dados
    if (typeof db !== 'undefined') {
        db.collection("comentarios").add(novoComentario)
            .then(() => {
                textarea.value = "";
                notaSelecionada = 0;
                atualizarEstrelas(0);

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Obrigado!',
                        text: 'Sua avaliação foi enviada com sucesso!',
                        timer: 1800,
                        showConfirmButton: false
                    });
                } else {
                    alert("Obrigado pela sua avaliação!");
                }
            })
            .catch((error) => {
                console.error("Erro ao salvar comentário no Firebase:", error);
                alert("Erro ao enviar comentário. Tente novamente!");
            });
    } else {
        alert("Conexão com o banco de dados não encontrada.");
    }
}

// 5. OUVINTE EM TEMPO REAL (Carrega lista geral e últimos comentários)
function escutarComentariosFirebase() {
    if (typeof db === 'undefined') return;

    // Escuta a coleção "comentarios" em tempo real
    db.collection("comentarios")
        .orderBy("dataCriacao", "desc")
        .onSnapshot((snapshot) => {
            const comentarios = [];

            snapshot.forEach((doc) => {
                const dados = doc.data();

                // Formata a data do Firebase
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

            // Atualiza os dois locais da tela
            renderizarUltimosComentarios(comentarios);
            renderizarTodosComentarios(comentarios);
        }, (error) => {
            console.error("Erro ao carregar comentários do Firebase:", error);
        });
}

// Renderiza os 5 últimos comentários
function renderizarUltimosComentarios(comentarios) {
    const lista = document.getElementById("ultimos-comentarios");
    if (!lista) return;

    lista.innerHTML = "";

    if (comentarios.length === 0) {
        lista.innerHTML = "<p style='color: white; text-align: center; width: 100%;'>Nenhuma avaliação ainda.</p>";
        return;
    }

    comentarios.slice(0, 5).forEach((comentario) => {
    lista.appendChild(criarCardComentario(comentario));
    });
}

// Renderiza a lista completa de comentários
function renderizarTodosComentarios(comentarios) {
    const lista = document.getElementById("lista-comentarios");
    if (!lista) return;

    lista.innerHTML = "";

    if (comentarios.length === 0) {
        lista.innerHTML = "<p style='color: white; text-align: center; width: 100%;'>Nenhum comentário cadastrado ainda.</p>";
        return;
    }

     comentarios.forEach((comentario) => {
    lista.appendChild(criarCardComentario(comentario));
});
}
function criarCardComentario(comentario) {
    const card = document.createElement("div");
    card.className = "comentario-card";

    const topo = document.createElement("div");
    topo.className = "comentario-topo";

    const nome = document.createElement("strong");
    nome.textContent = comentario.nome + ":";

    const data = document.createElement("span");
    data.className = "comentario-data";
    data.textContent = comentario.data;

    topo.append(nome, data);
    card.appendChild(topo);

    const corpo = document.createElement("div");
    corpo.className = "comentario-corpo";

    const estrelas = document.createElement("span");
    estrelas.className = "comentario-estrelas";
    estrelas.textContent = "⭐".repeat(
        Math.max(
            0,
            Math.min(5, Number(comentario.nota) || 0)
        )
    );

    const texto = document.createElement("span");
    texto.className = "comentario-texto";
    texto.textContent = comentario.texto;

    corpo.append(estrelas, texto);
    card.appendChild(corpo);

    return card;
}

// 6. Inicialização segura
function inicializar() {
    configurarEstrelas();
    escutarComentariosFirebase();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}
