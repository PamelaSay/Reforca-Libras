"use strict";

const VIDEO_TESTE = "https://www.youtube.com/embed/r9AoQVkUUvU";
const TOTAL_VIDAS = 3;
const QUESTOES_POR_PARTIDA = 10;

function criarQuestao(dados) {
    return {
        ...dados,
        videoPergunta: dados.videoPergunta || "",
        videoDica: dados.videoDica || "",
        videoExplicacao: dados.videoExplicacao || ""
    };
}

const V = VIDEO_TESTE;

const configuracaoModulos = {
    potenciacao: { titulo: "Potenciação", instrucao: "Analise a potência e escolha a alternativa correta." },
    casosEspeciais: { titulo: "Casos especiais", instrucao: "Observe atentamente a base e o expoente." },
    baseDez: { titulo: "Potências de base 10", instrucao: "Relacione a potência com sua escrita numérica." },
    propriedades: { titulo: "Propriedades", instrucao: "Identifique a propriedade adequada para resolver o desafio." }
};

const bancoDeQuestoes = {
    potenciacao: [
        {id:"pot-01",topico:"Leitura de potência",nivel:1,pergunta:"Como se lê corretamente a potência 2³?",representacao:"2³",alternativas:["Dois elevado ao cubo","Dois vezes três","Três elevado ao quadrado","Dois elevado a três vezes"],correta:"Dois elevado ao cubo",dica:"O número pequeno indica o expoente da potência.",explicacao:"A expressão 2³ é lida como dois elevado à terceira potência ou dois elevado ao cubo.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-02",topico:"Elementos da potência",nivel:1,pergunta:"Na potência 5⁴, qual número é a base?",representacao:"5⁴",alternativas:["5","4","20","625"],correta:"5",dica:"A base é o número que será multiplicado por ele mesmo.",explicacao:"Em 5⁴, a base é 5 e o expoente é 4.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-03",topico:"Elementos da potência",nivel:1,pergunta:"Na potência 7², qual número é o expoente?",representacao:"7²",alternativas:["2","7","14","49"],correta:"2",dica:"O expoente aparece acima e à direita da base.",explicacao:"Em 7², o número 7 é a base e o número 2 é o expoente.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-04",topico:"Representação",nivel:1,pergunta:"Qual potência representa 3 × 3 × 3 × 3?",representacao:"3 × 3 × 3 × 3",alternativas:["3⁴","4³","3 × 4","12²"],correta:"3⁴",dica:"Conte quantas vezes o fator 3 aparece.",explicacao:"O fator 3 aparece quatro vezes. Portanto, o produto é representado por 3⁴.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-05",topico:"Desenvolvimento",nivel:1,pergunta:"Qual produto representa corretamente 4³?",representacao:"4³",alternativas:["4 × 4 × 4","4 × 3","3 × 3 × 3 × 3","4 + 4 + 4"],correta:"4 × 4 × 4",dica:"O expoente indica quantas vezes a base aparece como fator.",explicacao:"Em 4³, a base 4 aparece três vezes como fator: 4 × 4 × 4.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-06",topico:"Cálculo",nivel:2,pergunta:"Qual é o valor de 3³?",representacao:"3³",alternativas:["27","9","6","81"],correta:"27",dica:"Escreva a base três vezes como fator.",explicacao:"3³ = 3 × 3 × 3 = 27.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-07",topico:"Cálculo",nivel:2,pergunta:"Qual é o valor de 2⁵?",representacao:"2⁵",alternativas:["32","10","25","16"],correta:"32",dica:"Multiplique cinco fatores iguais a 2.",explicacao:"2⁵ = 2 × 2 × 2 × 2 × 2 = 32.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-08",topico:"Comparação",nivel:2,pergunta:"Qual das potências possui o maior valor?",representacao:"2⁴     3²     5¹     2³",alternativas:["2⁴","3²","5¹","2³"],correta:"2⁴",dica:"Calcule o valor de cada potência antes de comparar.",explicacao:"2⁴ = 16, 3² = 9, 5¹ = 5 e 2³ = 8. Portanto, 2⁴ é a maior.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-09",topico:"Problema",nivel:2,pergunta:"Um quadrado possui lado medindo 6 cm. Qual potência representa sua área?",representacao:"Área = lado × lado",alternativas:["6²","6³","2⁶","6 × 2"],correta:"6²",dica:"A área do quadrado é o produto da medida do lado por ela mesma.",explicacao:"Como a área é 6 × 6, podemos representá-la por 6².",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pot-10",topico:"Problema",nivel:3,pergunta:"Um cubo possui aresta medindo 4 cm. Qual é o seu volume?",representacao:"Volume = aresta³",alternativas:["64 cm³","16 cm³","12 cm³","8 cm³"],correta:"64 cm³",dica:"Multiplique 4 por ele mesmo três vezes.",explicacao:"O volume é 4³ = 4 × 4 × 4 = 64 cm³.",videoPergunta:V,videoDica:V,videoExplicacao:V}
    ],
    casosEspeciais: [
        {id:"esp-01",topico:"Expoente zero",nivel:1,pergunta:"Qual é o valor de 8⁰?",representacao:"8⁰",alternativas:["1","0","8","80"],correta:"1",dica:"Considere a regra para base não nula e expoente zero.",explicacao:"Toda potência de base diferente de zero e expoente zero é igual a 1.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-02",topico:"Expoente um",nivel:1,pergunta:"Qual é o valor de 12¹?",representacao:"12¹",alternativas:["12","1","0","144"],correta:"12",dica:"Observe quantas vezes a base aparece como fator.",explicacao:"Toda potência de expoente 1 é igual à própria base.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-03",topico:"Base um",nivel:1,pergunta:"Qual é o valor de 1⁹?",representacao:"1⁹",alternativas:["1","9","0","81"],correta:"1",dica:"Multiplicar 1 por ele mesmo não altera seu valor.",explicacao:"Uma potência de base 1 é sempre igual a 1.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-04",topico:"Base zero",nivel:1,pergunta:"Qual é o valor de 0⁵?",representacao:"0⁵",alternativas:["0","1","5","Não existe"],correta:"0",dica:"A base zero será multiplicada por ela mesma cinco vezes.",explicacao:"Zero elevado a um expoente natural positivo é igual a zero.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-05",topico:"Expoente zero",nivel:2,pergunta:"Qual igualdade está correta?",representacao:"a ≠ 0",alternativas:["a⁰ = 1","a⁰ = 0","a⁰ = a","a⁰ = −a"],correta:"a⁰ = 1",dica:"A condição a ≠ 0 é importante.",explicacao:"Para toda base a diferente de zero, temos a⁰ = 1.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-06",topico:"Base negativa",nivel:2,pergunta:"Qual é o valor de (−3)²?",representacao:"(−3)²",alternativas:["9","−9","6","−6"],correta:"9",dica:"O sinal negativo faz parte da base.",explicacao:"(−3)² = (−3) × (−3) = 9.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-07",topico:"Base negativa",nivel:2,pergunta:"Qual é o valor de (−2)³?",representacao:"(−2)³",alternativas:["−8","8","−6","6"],correta:"−8",dica:"Uma quantidade ímpar de fatores negativos produz resultado negativo.",explicacao:"(−2)³ = (−2) × (−2) × (−2) = −8.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-08",topico:"Parênteses",nivel:2,pergunta:"Qual é o valor de −2²?",representacao:"−2²",alternativas:["−4","4","−2","2"],correta:"−4",dica:"Sem parênteses, o expoente atua somente sobre o 2.",explicacao:"Calculamos primeiro 2² = 4 e depois aplicamos o sinal negativo: −4.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-09",topico:"Comparação de sinais",nivel:3,pergunta:"Qual afirmação está correta?",representacao:"(−4)²     −4²",alternativas:["(−4)² = 16 e −4² = −16","As duas são iguais a 16","As duas são iguais a −16","(−4)² = −16 e −4² = 16"],correta:"(−4)² = 16 e −4² = −16",dica:"Observe onde estão os parênteses.",explicacao:"Em (−4)² a base é −4; em −4², somente o 4 está elevado ao quadrado.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"esp-10",topico:"Análise",nivel:3,pergunta:"Qual expressão possui resultado igual a 1?",representacao:"Escolha uma expressão",alternativas:["15⁰","0⁶","6¹","(−1)³"],correta:"15⁰",dica:"Procure uma base não nula com expoente zero.",explicacao:"Como 15 é diferente de zero, 15⁰ = 1.",videoPergunta:V,videoDica:V,videoExplicacao:V}
    ],
    baseDez: [
        {id:"dez-01",topico:"Cálculo",nivel:1,pergunta:"Qual é o valor de 10²?",representacao:"10²",alternativas:["100","20","10","1 000"],correta:"100",dica:"O expoente indica a quantidade de fatores iguais a 10.",explicacao:"10² = 10 × 10 = 100.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-02",topico:"Cálculo",nivel:1,pergunta:"Qual é o valor de 10⁴?",representacao:"10⁴",alternativas:["10 000","1 000","40","100 000"],correta:"10 000",dica:"Escreva o número 1 seguido de quatro zeros.",explicacao:"10⁴ = 10 000.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-03",topico:"Representação",nivel:1,pergunta:"Qual potência representa 1 000?",representacao:"1 000",alternativas:["10³","10²","10⁴","10 × 3"],correta:"10³",dica:"Conte os zeros depois do número 1.",explicacao:"1 000 possui três zeros. Portanto, 1 000 = 10³.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-04",topico:"Representação",nivel:1,pergunta:"Qual número é representado por 10⁵?",representacao:"10⁵",alternativas:["100 000","10 000","1 000 000","50"],correta:"100 000",dica:"Escreva o número 1 seguido de cinco zeros.",explicacao:"10⁵ = 100 000.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-05",topico:"Decomposição",nivel:2,pergunta:"Qual é o valor de 4 × 10³?",representacao:"4 × 10³",alternativas:["4 000","400","40","12 000"],correta:"4 000",dica:"Primeiro determine o valor de 10³.",explicacao:"10³ = 1 000; logo, 4 × 1 000 = 4 000.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-06",topico:"Decomposição",nivel:2,pergunta:"Qual expressão representa 70 000?",representacao:"70 000",alternativas:["7 × 10⁴","7 × 10³","70 × 10⁴","7⁴"],correta:"7 × 10⁴",dica:"Determine o valor de 10⁴.",explicacao:"7 × 10⁴ = 7 × 10 000 = 70 000.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-07",topico:"Sistema decimal",nivel:2,pergunta:"Qual é o valor posicional do algarismo 6 em 6 234?",representacao:"6 234",alternativas:["6 × 10³","6 × 10²","6 × 10¹","6 × 10⁴"],correta:"6 × 10³",dica:"O 6 ocupa a ordem dos milhares.",explicacao:"O algarismo 6 representa 6 000 = 6 × 10³.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-08",topico:"Decomposição decimal",nivel:3,pergunta:"Qual é a decomposição correta de 3 205?",representacao:"3 205",alternativas:["3 × 10³ + 2 × 10² + 5 × 10⁰","3 × 10² + 2 × 10¹ + 5 × 10⁰","3 × 10³ + 2 × 10¹ + 5 × 10⁰","3 × 10⁴ + 2 × 10³ + 5 × 10²"],correta:"3 × 10³ + 2 × 10² + 5 × 10⁰",dica:"Observe a posição de cada algarismo.",explicacao:"3 205 = 3 × 10³ + 2 × 10² + 0 × 10¹ + 5 × 10⁰.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-09",topico:"Comparação",nivel:2,pergunta:"Qual potência representa o maior número?",representacao:"10³     10⁵     10²     10⁴",alternativas:["10⁵","10⁴","10³","10²"],correta:"10⁵",dica:"Compare os expoentes.",explicacao:"Com a mesma base 10, o maior expoente produz o maior valor.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"dez-10",topico:"Problema",nivel:3,pergunta:"Um arquivo possui 2 × 10⁶ bytes. Quantos bytes ele possui?",representacao:"2 × 10⁶ bytes",alternativas:["2 000 000 bytes","200 000 bytes","20 000 000 bytes","12 000 000 bytes"],correta:"2 000 000 bytes",dica:"10⁶ é o número 1 seguido de seis zeros.",explicacao:"2 × 10⁶ = 2 × 1 000 000 = 2 000 000 bytes.",videoPergunta:V,videoDica:V,videoExplicacao:V}
    ],
    propriedades: [
        {id:"pro-01",topico:"Produto de potências",nivel:1,pergunta:"Simplifique 2³ × 2⁴.",representacao:"2³ × 2⁴",alternativas:["2⁷","4⁷","2¹²","4¹²"],correta:"2⁷",dica:"As potências possuem a mesma base.",explicacao:"Conservamos a base e somamos os expoentes: 2³ × 2⁴ = 2⁷.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-02",topico:"Produto de potências",nivel:1,pergunta:"Simplifique a⁵ × a².",representacao:"a⁵ × a²",alternativas:["a⁷","a¹⁰","2a⁷","a³"],correta:"a⁷",dica:"As potências possuem a mesma base.",explicacao:"a⁵ × a² = a⁵⁺² = a⁷.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-03",topico:"Quociente de potências",nivel:1,pergunta:"Simplifique 5⁸ ÷ 5³.",representacao:"5⁸ ÷ 5³",alternativas:["5⁵","5¹¹","1⁵","5²⁴"],correta:"5⁵",dica:"Conserve a base e considere os expoentes.",explicacao:"5⁸ ÷ 5³ = 5⁸⁻³ = 5⁵.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-04",topico:"Quociente de potências",nivel:1,pergunta:"Simplifique x⁶ ÷ x².",representacao:"x⁶ ÷ x²",alternativas:["x⁴","x³","x⁸","x¹²"],correta:"x⁴",dica:"As potências têm a mesma base.",explicacao:"x⁶ ÷ x² = x⁶⁻² = x⁴.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-05",topico:"Potência de potência",nivel:2,pergunta:"Simplifique (3²)⁴.",representacao:"(3²)⁴",alternativas:["3⁸","3⁶","3¹⁶","12²"],correta:"3⁸",dica:"Existe uma potência elevada a outro expoente.",explicacao:"Multiplicamos os expoentes: (3²)⁴ = 3⁸.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-06",topico:"Potência de potência",nivel:2,pergunta:"Qual expressão equivale a (a³)²?",representacao:"(a³)²",alternativas:["a⁶","a⁵","a⁹","2a³"],correta:"a⁶",dica:"Observe os dois expoentes.",explicacao:"(a³)² = a³·² = a⁶.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-07",topico:"Potência de um produto",nivel:2,pergunta:"Qual expressão equivale a (2 × 5)³?",representacao:"(2 × 5)³",alternativas:["2³ × 5³","2³ × 5","2 × 5³","2⁵ × 5²"],correta:"2³ × 5³",dica:"O expoente atua sobre todos os fatores.",explicacao:"(2 × 5)³ = 2³ × 5³.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-08",topico:"Potência de um quociente",nivel:2,pergunta:"Qual expressão equivale a (6 ÷ 3)²?",representacao:"(6 ÷ 3)²",alternativas:["6² ÷ 3²","6² ÷ 3","6 ÷ 3²","6³ ÷ 3²"],correta:"6² ÷ 3²",dica:"O expoente atua sobre os dois termos.",explicacao:"(6 ÷ 3)² = 6² ÷ 3².",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-09",topico:"Desafio combinado",nivel:3,pergunta:"Simplifique (2³ × 2²) ÷ 2⁴.",representacao:"(2³ × 2²) ÷ 2⁴",alternativas:["2","2⁵","2⁹","1"],correta:"2",dica:"Resolva primeiro o produto e depois o quociente.",explicacao:"(2³ × 2²) ÷ 2⁴ = 2³⁺²⁻⁴ = 2¹ = 2.",videoPergunta:V,videoDica:V,videoExplicacao:V},
        {id:"pro-10",topico:"Análise de erro",nivel:3,pergunta:"Um aluno afirmou que 3² × 3⁴ = 9⁶. Qual é a correção?",representacao:"3² × 3⁴",alternativas:["3² × 3⁴ = 3⁶","3² × 3⁴ = 9⁸","3² × 3⁴ = 6⁶","3² × 3⁴ = 3⁸"],correta:"3² × 3⁴ = 3⁶",dica:"A base deve ser conservada.",explicacao:"Conservamos a base 3 e somamos os expoentes: 3² × 3⁴ = 3⁶.",videoPergunta:V,videoDica:V,videoExplicacao:V}
    ]
};

Object.keys(bancoDeQuestoes).forEach(modulo => {
    bancoDeQuestoes[modulo] = bancoDeQuestoes[modulo].map(criarQuestao);
});

let moduloAtual = "potenciacao";
let questoesDaPartida = [];
let indiceQuestao = 0;
let pontos = 0;
let vidas = TOTAL_VIDAS;
let sequenciaAcertos = 0;
let respostaBloqueada = false;
let dicaUtilizada = false;
let resultadosDaPartida = [];
const elementos = {};

document.addEventListener("DOMContentLoaded", iniciarAplicacao);

function iniciarAplicacao() {
    localizarElementos();
    adicionarEventos();
    const parametros = new URLSearchParams(window.location.search);
    const moduloRecebido = parametros.get("modulo");
    if (moduloRecebido && bancoDeQuestoes[moduloRecebido]) moduloAtual = moduloRecebido;
    carregarModulosConcluidos();
    iniciarPartida(moduloAtual);
}

function localizarElementos() {
    const ids = {
        pontos:"pontos",questaoAtual:"questaoAtual",totalQuestoes:"totalQuestoes",tituloModulo:"tituloModulo",
        topico:"topicoPergunta",nivel:"nivelPergunta",instrucao:"instrucao",pergunta:"textoPergunta",
        representacao:"representacaoDesafio",alternativas:"alternativas",botaoDica:"botaoDica",areaDica:"areaDica",
        textoDica:"textoDica",video:"videoLibras",videoIndisponivel:"videoIndisponivel",repetirLibras:"botaoRepetirLibras",
        preenchimento:"preenchimentoProgresso",barraProgresso:"barraProgresso",porcentagem:"porcentagemProgresso",
        vidas:"vidas",sequencia:"valorSequencia",botaoVoltar:"botaoVoltar",botaoSair:"botaoSair"
    };
    Object.entries(ids).forEach(([chave,id]) => elementos[chave] = document.getElementById(id));
    elementos.botoesModulo = document.querySelectorAll(".botao-modulo");
}

function adicionarEventos() {
    elementos.botaoDica.addEventListener("click", alternarDica);
    elementos.repetirLibras.addEventListener("click", repetirTraducao);
    elementos.botaoVoltar.addEventListener("click", sairDoJogo);
    elementos.botaoSair.addEventListener("click", sairDoJogo);
    elementos.botoesModulo.forEach(botao => botao.addEventListener("click", () => selecionarModulo(botao.dataset.modulo)));
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function iniciarPartida(modulo) {
    moduloAtual = modulo;
    indiceQuestao = 0; pontos = 0; vidas = TOTAL_VIDAS; sequenciaAcertos = 0;
    respostaBloqueada = false; dicaUtilizada = false; resultadosDaPartida = [];
    questoesDaPartida = embaralhar(bancoDeQuestoes[modulo]).slice(0, QUESTOES_POR_PARTIDA).map(q => ({...q, alternativasEmbaralhadas:embaralhar(q.alternativas)}));
    atualizarModuloAtivo();
    mostrarQuestao();
}

async function selecionarModulo(novoModulo) {
    if (!bancoDeQuestoes[novoModulo] || novoModulo === moduloAtual) return;
    if (resultadosDaPartida.length === 0) return iniciarPartida(novoModulo);
    const r = await Swal.fire({icon:"question",title:"Trocar de módulo?",text:"A partida atual será encerrada.",showCancelButton:true,confirmButtonText:"Trocar módulo",cancelButtonText:"Continuar aqui",confirmButtonColor:"#1d3557"});
    if (r.isConfirmed) iniciarPartida(novoModulo);
}

function atualizarModuloAtivo() {
    elementos.tituloModulo.textContent = configuracaoModulos[moduloAtual].titulo;
    elementos.instrucao.textContent = configuracaoModulos[moduloAtual].instrucao;
    elementos.botoesModulo.forEach(botao => {
        const ativo = botao.dataset.modulo === moduloAtual;
        botao.classList.toggle("ativo", ativo);
        botao.setAttribute("aria-pressed", String(ativo));
        const estado = botao.querySelector(".estado-modulo");
        if (estado && ativo) estado.textContent = "▶";
        else if (estado && botao.classList.contains("concluido")) estado.textContent = "✓";
        else if (estado) estado.textContent = "○";
    });
}

function mostrarQuestao() {
    const q = questoesDaPartida[indiceQuestao];
    if (!q) return finalizarPartida(true);
    respostaBloqueada = false; dicaUtilizada = false;
    elementos.topico.textContent = q.topico.toUpperCase();
    elementos.nivel.textContent = "NÍVEL " + q.nivel;
    elementos.pergunta.textContent = q.pergunta;
    elementos.representacao.textContent = q.representacao;
    elementos.textoDica.textContent = q.dica;
    elementos.areaDica.hidden = true;
    elementos.botaoDica.textContent = "💡 Ver dica";
    elementos.botaoDica.setAttribute("aria-expanded","false");
    criarAlternativas(q);
    carregarVideo(q.videoPergunta,"Tradução da pergunta em Libras");
    atualizarStatus();
}

function criarAlternativas(q) {
    elementos.alternativas.replaceChildren();
    q.alternativasEmbaralhadas.forEach((resposta,i) => {
        const botao = document.createElement("button");
        botao.type="button"; botao.className="botao-alternativa"; botao.dataset.resposta=resposta;
        const letra=document.createElement("span"); letra.className="letra-alternativa"; letra.textContent=["A","B","C","D"][i];
        const texto=document.createElement("span"); texto.textContent=resposta;
        botao.append(letra,texto);
        botao.addEventListener("click",()=>verificarResposta(resposta,botao));
        elementos.alternativas.appendChild(botao);
    });
}

function alternarDica() {
    const q=questoesDaPartida[indiceQuestao];
    const abrir=elementos.areaDica.hidden;
    elementos.areaDica.hidden=!abrir;
    elementos.botaoDica.textContent=abrir?"💡 Ocultar dica":"💡 Ver dica";
    elementos.botaoDica.setAttribute("aria-expanded",String(abrir));
    if(abrir){dicaUtilizada=true;carregarVideo(q.videoDica,"Tradução da dica em Libras");}
    else carregarVideo(q.videoPergunta,"Tradução da pergunta em Libras");
}

async function verificarResposta(resposta,botaoEscolhido) {
    if(respostaBloqueada)return;
    respostaBloqueada=true;
    const q=questoesDaPartida[indiceQuestao];
    const acertou=resposta===q.correta;
    elementos.alternativas.querySelectorAll(".botao-alternativa").forEach(botao=>{
        botao.disabled=true;
        if(botao.dataset.resposta===q.correta)botao.classList.add("correta");
        else if(botao===botaoEscolhido)botao.classList.add("incorreta");
        else botao.classList.add("neutra");
    });
    let ganhos=0;
    if(acertou){sequenciaAcertos++;ganhos=10+(sequenciaAcertos>=3?2:0);pontos+=ganhos;}
    else{sequenciaAcertos=0;vidas--;}
    resultadosDaPartida.push({idQuestao:q.id,ordem:indiceQuestao+1,topico:q.topico,pergunta:q.pergunta,respostaSelecionada:resposta,respostaCorreta:q.correta,alternativasApresentadas:[...q.alternativasEmbaralhadas],acertou,dicaUtilizada,pontosObtidos:ganhos});
    atualizarStatus();
    await mostrarExplicacao(q,acertou);
    if(vidas<=0)return finalizarPartida(false);
    indiceQuestao++;
    if(indiceQuestao>=questoesDaPartida.length)return finalizarPartida(true);
    mostrarQuestao();
}

function urlYouTube(url,autoplay=false){
    if(!url)return"";
    return url+(url.includes("?")?"&":"?")+"rel=0&modestbranding=1"+(autoplay?"&autoplay=1":"");
}

function carregarVideo(url,titulo){
    elementos.video.src="";
    if(!url){elementos.video.hidden=true;elementos.repetirLibras.hidden=true;elementos.videoIndisponivel.hidden=false;return;}
    elementos.video.title=titulo; elementos.video.src=urlYouTube(url); elementos.video.hidden=false;
    elementos.repetirLibras.hidden=false; elementos.videoIndisponivel.hidden=true;
}

function repetirTraducao(){
    const q=questoesDaPartida[indiceQuestao]; if(!q)return;
    const url=elementos.areaDica.hidden?q.videoPergunta:q.videoDica;
    elementos.video.src=""; setTimeout(()=>elementos.video.src=urlYouTube(url,true),100);
}

function mostrarExplicacao(q,acertou){
    const html=`<div class="explicacao-resposta"><div class="texto-explicacao">${q.explicacao}</div><iframe id="videoExplicacaoAlerta" class="video-explicacao" src="${urlYouTube(q.videoExplicacao)}" title="Explicação em Libras" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><button id="repetirExplicacaoAlerta" class="botao-alerta-repetir" type="button">↻ Repetir explicação em Libras</button></div>`;
    return Swal.fire({icon:acertou?"success":"error",title:acertou?"Resposta correta!":"Vamos revisar!",html,confirmButtonText:"Continuar",confirmButtonColor:"#1d3557",allowOutsideClick:false,customClass:{popup:"alerta-reforca"},didOpen(){const video=document.getElementById("videoExplicacaoAlerta");document.getElementById("repetirExplicacaoAlerta").onclick=()=>{video.src="";setTimeout(()=>video.src=urlYouTube(q.videoExplicacao,true),100);};},willClose(){const video=document.getElementById("videoExplicacaoAlerta");if(video)video.src="";}});
}

function atualizarStatus(){
    const total=questoesDaPartida.length, respondidas=resultadosDaPartida.length;
    const percentual=total?Math.round(respondidas/total*100):0;
    elementos.pontos.textContent=pontos; elementos.questaoAtual.textContent=Math.min(indiceQuestao+1,total);
    elementos.totalQuestoes.textContent=total; elementos.sequencia.textContent=sequenciaAcertos;
    elementos.preenchimento.style.width=percentual+"%"; elementos.porcentagem.textContent=percentual+"%";
    elementos.barraProgresso.setAttribute("aria-valuenow",String(percentual)); atualizarVidas();
}

function atualizarVidas(){
    elementos.vidas.replaceChildren();
    for(let i=0;i<TOTAL_VIDAS;i++){const s=document.createElement("span");s.setAttribute("aria-hidden","true");s.textContent=i<vidas?"❤️":"🩶";elementos.vidas.appendChild(s);}
    const acessivel=document.createElement("span");acessivel.className="somente-leitor";acessivel.textContent=vidas+" vidas restantes";elementos.vidas.appendChild(acessivel);
}

function chaveLocal(base){return typeof chaveLocalDoUsuario==="function"?chaveLocalDoUsuario(base):base+"_visitante";}

function salvarResultadoLocal(resultado){
    const chave=chaveLocal("resultadosJogoPotenciacao");let historico=[];
    try{historico=JSON.parse(localStorage.getItem(chave))||[];}catch(e){historico=[];}
    historico.push(resultado);localStorage.setItem(chave,JSON.stringify(historico));
}

function marcarModuloConcluido(modulo){
    const chave=chaveLocal("modulosJogoPotenciacaoConcluidos");let lista=[];
    try{lista=JSON.parse(localStorage.getItem(chave))||[];}catch(e){lista=[];}
    if(!lista.includes(modulo))lista.push(modulo);localStorage.setItem(chave,JSON.stringify(lista));carregarModulosConcluidos();
}

function carregarModulosConcluidos(){
    const chave=chaveLocal("modulosJogoPotenciacaoConcluidos");let lista=[];
    try{lista=JSON.parse(localStorage.getItem(chave))||[];}catch(e){lista=[];}
    elementos.botoesModulo.forEach(botao=>botao.classList.toggle("concluido",lista.includes(botao.dataset.modulo)));
}

async function salvarFirebase(resultado){
    if(typeof auth==="undefined"||typeof db==="undefined"||!auth||!db||!auth.currentUser)return;
    try{await db.collection("usuarios").doc(auth.currentUser.uid).collection("resultados").add({...resultado,realizadoEm:firebase.firestore.FieldValue.serverTimestamp()});}
    catch(erro){console.error("Erro ao salvar resultado:",erro);}
}

async function finalizarPartida(concluiu){
    elementos.video.src="";
    const acertos=resultadosDaPartida.filter(r=>r.acertou).length;
    const total=resultadosDaPartida.length;
    const resultado={jogo:"jogo_matematica_potenciacao",tematica:"Potenciação",modulo:moduloAtual,nomeModulo:configuracaoModulos[moduloAtual].titulo,pontuacao:pontos,acertos,erros:total-acertos,totalRespondido:total,percentual:total?Math.round(acertos/total*100):0,concluido,respostas:resultadosDaPartida,realizadoEm:new Date().toISOString()};
    salvarResultadoLocal(resultado);if(concluiu)marcarModuloConcluido(moduloAtual);salvarFirebase(resultado);
    const r=await Swal.fire({icon:concluiu?"success":"warning",title:concluiu?"Módulo concluído!":"Suas vidas terminaram",html:`Você acertou <strong>${acertos} de ${total}</strong> desafios.<br>Pontuação: <strong>${pontos}</strong>.<br>Aproveitamento: <strong>${resultado.percentual}%</strong>.`,showDenyButton:true,showCancelButton:true,confirmButtonText:"Jogar novamente",denyButtonText:"Escolher outro módulo",cancelButtonText:"Avaliar o jogo",confirmButtonColor:"#1d3557",denyButtonColor:"#5fa8d3",cancelButtonColor:"#d9a900",allowOutsideClick:false});
    if(r.isConfirmed)iniciarPartida(moduloAtual);else if(r.isDenied)document.querySelector(".mapa-modulos").scrollIntoView({behavior:"smooth"});else window.location.href="index.html#avaliacao";
}
async function sairDoJogo() {
    const partidaIniciada =
        resultadosDaPartida.length > 0;

    const mensagem = partidaIniciada
        ? "O progresso desta partida ainda não foi concluído. Deseja realmente sair?"
        : "Deseja sair do jogo e voltar para a trilha de potenciação?";

    const videoSaida =
        "https://www.youtube.com/embed/r9AoQVkUUvU";

    const resposta = await Swal.fire({
        icon: "question",
        title: "Sair do jogo?",

        html: `
            <div class="explicacao-resposta">

                <div class="texto-explicacao">
                    ${mensagem}
                </div>

                <iframe
                    id="videoAlertaSaida"
                    class="video-explicacao"
                    src="${urlYouTube(videoSaida)}"
                    title="Tradução do alerta de saída em Libras"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>

                <button
                    id="repetirAlertaSaida"
                    class="botao-alerta-repetir"
                    type="button"
                >
                    ↻ Repetir tradução em Libras
                </button>

            </div>
        `,

        showCancelButton: true,
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Continuar jogando",

        confirmButtonColor: "#d94b4b",
        cancelButtonColor: "#1d3557",

        allowOutsideClick: false,
        allowEscapeKey: false,

        customClass: {
            popup: "alerta-reforca"
        },

        didOpen: function () {
            const video =
                document.getElementById(
                    "videoAlertaSaida"
                );

            const botaoRepetir =
                document.getElementById(
                    "repetirAlertaSaida"
                );

            if (!video || !botaoRepetir) return;

            botaoRepetir.addEventListener(
                "click",
                function () {
                    video.src = "";

                    setTimeout(function () {
                        video.src = urlYouTube(
                            videoSaida,
                            true
                        );
                    }, 100);
                }
            );
        },

        willClose: function () {
            const video =
                document.getElementById(
                    "videoAlertaSaida"
                );

            if (video) {
                video.src = "";
            }
        }
    });

    if (resposta.isConfirmed) {
        voltarParaTrilha();
    }
}

function voltarParaTrilha(){elementos.video.src="";window.location.href="potenciacao.html";}
