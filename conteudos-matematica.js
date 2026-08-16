/*
 * Cadastre os novos conteúdos nesta lista.
 * A data determina a ordem: os mais recentes aparecem primeiro.
 */
const conteudosMatematica = [
  {
    titulo: "Radiciação",
    descricao:
      "Compreenda a raiz como operação inversa da potenciação e pratique seus principais conceitos.",
    icone: "√",
    data: "2026-08-01",
    aula: "aulas/radiciacao.html",
    atividade: "jogos/radiciacao.html",
    categoria: "Números"
  },
  {
    titulo: "Potenciação",
    descricao:
      "Aprenda a representar potências, identificar base e expoente e aplicar suas propriedades.",
    icone: "x²",
    data: "2026-07-01",
    aula: "aulas/potenciacao.html",
    atividade: "jogos/potencia.html",
    categoria: "Números"
  }
];

/*
 * Organiza os conteúdos do mais recente para o mais antigo.
 */
function ordenarConteudos(conteudos) {
  return [...conteudos].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
}

/*
 * Cria cada card de conteúdo.
 */
function criarCard(conteudo, indice) {
  const card = document.createElement("article");

  card.className = "card-conteudo";

  card.innerHTML = `
    ${
      indice < 2
        ? '<span class="novo">RECENTE</span>'
        : ""
    }

    <div class="card-topo" aria-hidden="true">
      ${conteudo.icone}
    </div>

    <div class="card-corpo">
      <div class="card-meta">
        <span>${conteudo.categoria}</span>
        <span>Aula em Libras</span>
      </div>

      <h3>${conteudo.titulo}</h3>

      <p>${conteudo.descricao}</p>

      <div class="card-acoes">
        <a class="botao-card" href="${conteudo.aula}">
          Ver aula
        </a>

        <a
          class="botao-card secundario"
          href="${conteudo.atividade}"
        >
          Praticar
        </a>
      </div>
    </div>
  `;

  return card;
}

/*
 * Controla a página com todos os conteúdos.
 */
function iniciarPaginaMatematica() {
  const lista = document.querySelector("#lista-conteudos");

  if (!lista) {
    return;
  }

  const pesquisa = document.querySelector("#pesquisa-conteudo");
  const contador = document.querySelector("#quantidade-conteudos");
  const paginacao = document.querySelector("#paginacao");
  const semResultados = document.querySelector("#sem-resultados");

  const conteudosOrdenados = ordenarConteudos(
    conteudosMatematica
  );

  /*
   * Quantidade de cards mostrados em cada página.
   */
  const itensPorPagina = 6;

  let conteudosFiltrados = conteudosOrdenados;
  let paginaAtual = 1;

  /*
   * Cria os botões da paginação.
   */
  function criarBotaoPaginacao(
    texto,
    pagina,
    rotulo,
    desabilitado = false
  ) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;
    botao.setAttribute("aria-label", rotulo);
    botao.disabled = desabilitado;

    /*
     * Destaca a página atual.
     */
    if (
      pagina === paginaAtual &&
      typeof texto === "number"
    ) {
      botao.classList.add("active");
      botao.setAttribute("aria-current", "page");
    }

    botao.addEventListener("click", function () {
      paginaAtual = pagina;

      exibirPagina();

      lista.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    return botao;
  }

  /*
   * Atualiza os números e as setas da paginação.
   */
  function atualizarPaginacao(totalPaginas) {
    paginacao.replaceChildren();

    /*
     * Esconde a paginação quando existe somente uma página.
     */
    paginacao.hidden = totalPaginas <= 1;

    if (totalPaginas <= 1) {
      return;
    }

    /*
     * Botão para voltar.
     */
    paginacao.appendChild(
      criarBotaoPaginacao(
        "«",
        paginaAtual - 1,
        "Página anterior",
        paginaAtual === 1
      )
    );

    /*
     * Botões numerados.
     */
    for (
      let numeroPagina = 1;
      numeroPagina <= totalPaginas;
      numeroPagina += 1
    ) {
      paginacao.appendChild(
        criarBotaoPaginacao(
          numeroPagina,
          numeroPagina,
          `Ir para a página ${numeroPagina}`
        )
      );
    }

    /*
     * Botão para avançar.
     */
    paginacao.appendChild(
      criarBotaoPaginacao(
        "»",
        paginaAtual + 1,
        "Próxima página",
        paginaAtual === totalPaginas
      )
    );
  }

  /*
   * Exibe somente os conteúdos da página atual.
   */
  function exibirPagina() {
    const totalPaginas = Math.ceil(
      conteudosFiltrados.length / itensPorPagina
    );

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const final = inicio + itensPorPagina;

    const conteudosDaPagina = conteudosFiltrados.slice(
      inicio,
      final
    );

    const cards = conteudosDaPagina.map(function (conteudo) {
      const posicaoOriginal =
        conteudosOrdenados.indexOf(conteudo);

      return criarCard(conteudo, posicaoOriginal);
    });

    lista.replaceChildren(...cards);

    /*
     * Atualiza a quantidade de conteúdos encontrados.
     */
    if (contador) {
      const palavra =
        conteudosFiltrados.length === 1
          ? "conteúdo"
          : "conteúdos";

      contador.textContent =
        `${conteudosFiltrados.length} ${palavra}`;
    }

    /*
     * Mostra a mensagem quando a pesquisa não encontra nada.
     */
    if (semResultados) {
      semResultados.hidden =
        conteudosFiltrados.length !== 0;
    }

    atualizarPaginacao(totalPaginas);
  }

  /*
   * Pesquisa pelo título, descrição ou categoria.
   */
  if (pesquisa) {
    pesquisa.addEventListener("input", function () {
      const termo = pesquisa.value
        .trim()
        .toLocaleLowerCase("pt-BR");

      conteudosFiltrados = conteudosOrdenados.filter(
        function (conteudo) {
          const textoCompleto = `
            ${conteudo.titulo}
            ${conteudo.descricao}
            ${conteudo.categoria}
          `.toLocaleLowerCase("pt-BR");

          return textoCompleto.includes(termo);
        }
      );

      /*
       * Toda nova pesquisa começa na primeira página.
       */
      paginaAtual = 1;

      exibirPagina();
    });
  }

  exibirPagina();
}

/*
 * Inicia o JavaScript quando o HTML estiver carregado.
 */
document.addEventListener("DOMContentLoaded", function () {
  iniciarPaginaMatematica();
});