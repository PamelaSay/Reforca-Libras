const VERSAO_TERMOS = "1.0";


// ==========================================
// ELEMENTOS DOS MODAIS
// ==========================================

const btnLogin = document.getElementById("btnLogin");

const modalLogin = document.getElementById("modalLogin");
const fecharLogin = document.getElementById("fecharLogin");

const abrirCadastro = document.getElementById("abrirCadastro");
const modalCadastro = document.getElementById("modalCadastro");
const fecharCadastro = document.getElementById("fecharCadastro");

const modalPerfil = document.getElementById("modalPerfil");
const fecharPerfil = document.getElementById("fecharPerfil");

const modalTermos = document.getElementById("modalTermos");
const abrirTermos = document.getElementById("abrirTermos");
const fecharTermos = document.getElementById("fecharTermos");
const concordarTermos = document.getElementById("concordarTermos");


// ==========================================
// ABRIR LOGIN OU PERFIL
// ==========================================

if (btnLogin) {
    btnLogin.onclick = function () {
        const usuarioLogado = obterUsuarioLocal();

        if (usuarioLogado) {
            mostrarPerfil();
        } else if (modalLogin) {
            modalLogin.style.display = "flex";
        }
    };
}


// ==========================================
// FECHAR MODAIS
// ==========================================

if (fecharLogin) {
    fecharLogin.onclick = function () {
        modalLogin.style.display = "none";
    };
}

if (fecharCadastro) {
    fecharCadastro.onclick = function () {
        modalCadastro.style.display = "none";
    };
}

if (fecharPerfil) {
    fecharPerfil.onclick = function () {
        modalPerfil.style.display = "none";
    };
}

if (fecharTermos) {
    fecharTermos.onclick = function () {
        modalTermos.style.display = "none";
    };
}


// ==========================================
// ABRIR CADASTRO
// ==========================================

if (abrirCadastro) {
    abrirCadastro.onclick = function () {
        if (modalLogin) {
            modalLogin.style.display = "none";
        }

        if (modalCadastro) {
            modalCadastro.style.display = "flex";
        }
    };
}


// ==========================================
// CÓDIGO DE ÉTICA
// ==========================================

if (abrirTermos) {
    abrirTermos.onclick = function () {
        if (modalTermos) {
            modalTermos.style.display = "flex";
        }
    };
}

if (concordarTermos) {
    concordarTermos.onclick = function () {
        const aceite = document.getElementById("aceitarTermos");

        if (aceite) {
            aceite.checked = true;
        }

        if (modalTermos) {
            modalTermos.style.display = "none";
        }
    };
}


// ==========================================
// USUÁRIO SALVO NO NAVEGADOR
// ==========================================

function obterUsuarioLocal() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}


// ==========================================
// CADASTRAR USUÁRIO
// ==========================================

async function cadastrar() {
    const nomeInput = document.getElementById("nomeCadastro");
    const emailInput = document.getElementById("emailCadastro");
    const senhaInput = document.getElementById("senhaCadastro");
    const aceiteInput = document.getElementById("aceitarTermos");

    if (!nomeInput || !emailInput || !senhaInput || !aceiteInput) {
        exibirAlerta(
            "error",
            "Erro",
            "Os campos do cadastro não foram encontrados."
        );

        return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;
    // O ranking público usa somente o nome informado no cadastro.
    const participarRanking = true;

    if (!nome) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe seu nome."
        );

        return;
    }

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe um e-mail válido."
        );

        return;
    }

    if (senha.length < 6) {
        exibirAlerta(
            "warning",
            "Atenção",
            "A senha deve ter pelo menos 6 caracteres."
        );

        return;
    }

    if (!aceiteInput.checked) {
        exibirAlerta(
            "warning",
            "Aceite necessário",
            "Leia e aceite o Código de Ética e os termos de participação."
        );

        return;
    }

    if (!auth || !db) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    let usuarioCriado = null;

    try {
        // Mantém a pessoa conectada depois de fechar o navegador.
        await auth.setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        );

        /*
         * A senha é enviada diretamente ao Firebase Authentication.
         * Ela não será gravada no Firestore.
         */
        const credencial =
            await auth.createUserWithEmailAndPassword(
                email,
                senha
            );

        usuarioCriado = credencial.user;

        // Guarda o nome no perfil do Firebase Authentication.
        await usuarioCriado.updateProfile({
            displayName: nome
        });

        /*
         * Dados que serão armazenados no Firestore.
         * Observe que não existe nenhum campo chamado "senha".
         */
        const dadosUsuario = {
            uid: usuarioCriado.uid,
            nome: nome,
            email: email,
            nivel: "Iniciante",
            pontos: 0,
            aulas: 0,
            jogos: 0,
            participarRanking: participarRanking,

            termosAceitos: true,
            versaoTermos: VERSAO_TERMOS,

            dataAceiteTermos:
                firebase.firestore.FieldValue.serverTimestamp(),

            dataCriacao:
                firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db
                .collection("usuarios")
                .doc(usuarioCriado.uid)
                .set(dadosUsuario);

        } catch (erroFirestore) {
            /*
             * Se o Firestore recusar a gravação, excluímos a conta
             * recém-criada para não deixar um cadastro incompleto.
             */
            await usuarioCriado.delete();

            throw erroFirestore;
        }

        const sessaoUsuario = {
            uid: usuarioCriado.uid,
            nome: nome,
            email: email,
            pontos: 0,
            aulas: 0,
            jogos: 0,
            participarRanking: participarRanking
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(sessaoUsuario)
        );

        if (modalCadastro) {
            modalCadastro.style.display = "none";
        }

        limparFormularioCadastro();
        mostrarUsuario();

        exibirAlerta(
            "success",
            "Cadastro concluído!",
            `Bem-vindo(a), ${nome}!`,
            1600
        );

    } catch (erro) {
        console.error("Erro no cadastro:", erro);

        exibirAlerta(
            "error",
            "Erro ao cadastrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// LOGIN
// ==========================================

async function login() {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("senhaLogin");

    if (!emailInput || !senhaInput) {
        exibirAlerta(
            "error",
            "Erro",
            "Os campos de login não foram encontrados."
        );

        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value;

    if (!email || !emailInput.checkValidity()) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe um e-mail válido."
        );

        return;
    }

    if (!senha) {
        exibirAlerta(
            "warning",
            "Atenção",
            "Informe sua senha."
        );

        return;
    }

    if (!auth || !db) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    try {
        await auth.setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        );

        const credencial =
            await auth.signInWithEmailAndPassword(
                email,
                senha
            );

        const usuario = credencial.user;

        const referencia = db
            .collection("usuarios")
            .doc(usuario.uid);

        const documento = await referencia.get();

        let dadosUsuario;

        if (documento.exists) {
            dadosUsuario = documento.data();

            /*
             * Se uma versão antiga do site salvou a senha no
             * Firestore, este trecho apaga somente esse campo.
             */
            if (
                Object.prototype.hasOwnProperty.call(
                    dadosUsuario,
                    "senha"
                )
            ) {
                await referencia.update({
                    senha:
                        firebase.firestore.FieldValue.delete()
                });

                delete dadosUsuario.senha;
            }

        } else {
            /*
             * Caso a conta exista no Authentication, mas ainda não
             * tenha um documento no Firestore, o perfil é recriado.
             */
            dadosUsuario = {
                uid: usuario.uid,

                nome:
                    usuario.displayName ||
                    email.split("@")[0],

                email: usuario.email,

                nivel: "Iniciante",
                pontos: 0,
                aulas: 0,
                jogos: 0,

                termosAceitos: false,

                dataCriacao:
                    firebase.firestore.FieldValue.serverTimestamp()
            };

            await referencia.set(dadosUsuario);
        }

        const sessaoUsuario = {
            uid: usuario.uid,

            nome:
                dadosUsuario.nome ||
                usuario.displayName ||
                email.split("@")[0],

            email: usuario.email,

            pontos: dadosUsuario.pontos || 0,
            aulas: dadosUsuario.aulas || 0,
            jogos: dadosUsuario.jogos || 0,
            participarRanking: Boolean(dadosUsuario.participarRanking)
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(sessaoUsuario)
        );

        if (modalLogin) {
            modalLogin.style.display = "none";
        }

        limparFormularioLogin();
        mostrarUsuario();

        exibirAlerta(
            "success",
            "Bem-vindo(a)!",
            `Olá, ${sessaoUsuario.nome}!`,
            1600
        );

    } catch (erro) {
        console.error("Erro no login:", erro);

        exibirAlerta(
            "error",
            "Não foi possível entrar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// MOSTRAR NOME DO USUÁRIO
// ==========================================

function mostrarUsuario() {
    const usuario = obterUsuarioLocal();

    if (!usuario) {
        if (btnLogin) {
            btnLogin.innerHTML = "👤 Entrar";
        }

        return;
    }

    if (btnLogin) {
        btnLogin.innerHTML = "👤 " + usuario.nome;
    }

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    const pontos =
        document.getElementById("pontos");

    const aulas =
        document.getElementById("aulas");

    const jogos =
        document.getElementById("jogos");

    if (nomeUsuario) {
        nomeUsuario.innerText = usuario.nome;
    }

    if (pontos) {
        pontos.innerText = usuario.pontos || 0;
    }

    if (aulas) {
        aulas.innerText = usuario.aulas || 0;
    }

    if (jogos) {
        jogos.innerText = usuario.jogos || 0;
    }
}


// ==========================================
// MOSTRAR PERFIL
// ==========================================

function mostrarPerfil() {
    const usuario = obterUsuarioLocal();

    if (!usuario) {
        if (modalLogin) {
            modalLogin.style.display = "flex";
        }

        return;
    }

    mostrarUsuario();
    atualizarPerfilLocal();
    sincronizarResumoNoFirebase();

    if (modalPerfil) {
        modalPerfil.style.display = "flex";
    }
}


// ==========================================
// RESUMO LOCAL DE APRENDIZAGEM
// ==========================================

function lerDadosLocais(chave, valorPadrao) {
    try {
        const valor = JSON.parse(localStorage.getItem(chave));
        return valor === null ? valorPadrao : valor;
    } catch (erro) {
        return valorPadrao;
    }
}

function obterResumoAprendizagem() {
    const progressoPotenciacao = lerDadosLocais(
        chaveLocalDoUsuario("progressoCursoPotenciacao"),
        { concluidas: [] }
    );
    const progressoRadiciacao = lerDadosLocais(
        chaveLocalDoUsuario("progressoCursoRadiciacao"),
        { concluidas: [] }
    );
    const resultadosPotenciacao = lerDadosLocais(
        chaveLocalDoUsuario("resultadosPotenciacao"),
        []
    );
    const resultadosRadiciacao = lerDadosLocais(
        chaveLocalDoUsuario("resultadosRadiciacao"),
        []
    );

    const concluidasPotenciacao = Array.isArray(
        progressoPotenciacao.concluidas
    ) ? progressoPotenciacao.concluidas.length : 0;
    const concluidasRadiciacao = Array.isArray(
        progressoRadiciacao.concluidas
    ) ? progressoRadiciacao.concluidas.length : 0;

    const todosResultados = []
        .concat(Array.isArray(resultadosPotenciacao) ? resultadosPotenciacao : [])
        .concat(Array.isArray(resultadosRadiciacao) ? resultadosRadiciacao : []);

    const percentuais = todosResultados
        .map(function (resultado) {
            return Number(resultado.percentual);
        })
        .filter(Number.isFinite);

    const media = percentuais.length
        ? Math.round(
            percentuais.reduce(function (total, valor) {
                return total + valor;
            }, 0) / percentuais.length
        )
        : 0;

    const pontos = todosResultados.reduce(function (total, resultado) {
        return total + (Number(resultado.pontuacao) || 0);
    }, 0);

    function mediaDaTrilha(resultados) {
        if (!Array.isArray(resultados) || !resultados.length) return null;
        const valores = resultados
            .map(function (resultado) { return Number(resultado.percentual); })
            .filter(Number.isFinite);
        if (!valores.length) return null;
        return Math.round(
            valores.reduce(function (total, valor) { return total + valor; }, 0) /
            valores.length
        );
    }

    return {
        aulas: concluidasPotenciacao + concluidasRadiciacao,
        jogos: todosResultados.length,
        media: media,
        pontos: pontos,
        potenciacao: {
            concluidas: concluidasPotenciacao,
            media: mediaDaTrilha(resultadosPotenciacao)
        },
        radiciacao: {
            concluidas: concluidasRadiciacao,
            media: mediaDaTrilha(resultadosRadiciacao)
        }
    };
}

function definirTexto(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = texto;
}

function atualizarPerfilLocal() {
    const usuario = obterUsuarioLocal();
    const resumo = obterResumoAprendizagem();

    if (usuario) {
        definirTexto("nomeUsuario", usuario.nome || "Aluno");
    }

    definirTexto("perfilAulas", resumo.aulas);
    definirTexto("perfilTestes", resumo.jogos);
    definirTexto("perfilMedia", resumo.media + "%");
    definirTexto("perfilPontos", resumo.pontos);

    atualizarTrilhaNoPerfil("Potenciacao", resumo.potenciacao);
    atualizarTrilhaNoPerfil("Radiciacao", resumo.radiciacao);

    const pontosFortes = document.getElementById("perfilPontosFortes");
    const recomendacoes = document.getElementById("perfilRecomendacoes");

    if (pontosFortes) {
        pontosFortes.replaceChildren();
        const texto = document.createElement("p");
        texto.textContent = resumo.jogos === 0
            ? "Realize as verificações para visualizar seus resultados."
            : resumo.media >= 70
                ? "Seu desempenho geral está acima de 70%. Continue avançando."
                : "Continue praticando para consolidar os conteúdos.";
        pontosFortes.appendChild(texto);
    }

    if (recomendacoes) {
        recomendacoes.replaceChildren();
        const texto = document.createElement("p");
        if (resumo.jogos === 0) {
            texto.textContent = "Comece pela trilha de Potenciação.";
        } else if (resumo.potenciacao.media !== null && resumo.potenciacao.media < 70) {
            texto.textContent = "Reveja a trilha de Potenciação e refaça o teste.";
        } else if (resumo.radiciacao.media !== null && resumo.radiciacao.media < 70) {
            texto.textContent = "Reveja a trilha de Radiciação e refaça o teste.";
        } else {
            texto.textContent = "Nenhuma revisão prioritária no momento.";
        }
        recomendacoes.appendChild(texto);
    }
}

function atualizarTrilhaNoPerfil(nome, dados) {
    const concluidas = Math.min(4, Number(dados.concluidas) || 0);
    definirTexto("perfil" + nome + "Texto", concluidas + " de 4 etapas");
    definirTexto(
        "perfil" + nome + "Media",
        dados.media === null ? "Sem resultados" : "Média: " + dados.media + "%"
    );

    const barra = document.getElementById("perfil" + nome + "Barra");
    if (barra) barra.style.width = Math.round((concluidas / 4) * 100) + "%";
}

async function sincronizarResumoNoFirebase() {
    if (!auth || !db || !auth.currentUser) return;

    const resumo = obterResumoAprendizagem();
    try {
        await db.collection("usuarios").doc(auth.currentUser.uid).set({
            pontos: resumo.pontos,
            aulas: resumo.aulas,
            jogos: resumo.jogos,
            media: resumo.media,
            atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        const usuario = obterUsuarioLocal();
        if (usuario) {
            Object.assign(usuario, {
                pontos: resumo.pontos,
                aulas: resumo.aulas,
                jogos: resumo.jogos
            });
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            mostrarUsuario();
        }
        atualizarRankingPublico();
    } catch (erro) {
        console.error("Erro ao sincronizar o resumo:", erro);
    }
}

function atualizarContinuarEstudando() {
    const area = document.getElementById("continuarEstudando");
    if (!area) return;

    const usuario = obterUsuarioLocal();
    area.replaceChildren();
    if (!usuario) return;

    const resumo = obterResumoAprendizagem();
    const titulo = document.createElement("h3");
    titulo.textContent = "📘 Continuar estudando";

    const link = document.createElement("a");
    if (resumo.potenciacao.concluidas < 4) {
        link.href = "potenciacao.html";
        link.textContent = "Continuar Potenciação →";
    } else {
        link.href = "radiciacao.html";
        link.textContent = "Continuar Radiciação →";
    }

    area.append(titulo, link);
}

async function atualizarRankingPublico() {
    const lista = document.getElementById("rankingLista");
    if (!lista || !db) return;

    try {
        const consulta = await db.collection("usuarios")
            .limit(50)
            .get();

        const participantes = [];
        consulta.forEach(function (documento) {
            const dados = documento.data();
            participantes.push({
                nome: dados.nome || "Aluno",
                pontos: Number(dados.pontos) || 0
            });
        });
        participantes.sort(function (a, b) { return b.pontos - a.pontos; });

        lista.replaceChildren();
        if (!participantes.length) {
            const vazio = document.createElement("p");
            vazio.textContent = "O ranking ainda não possui participantes.";
            lista.appendChild(vazio);
            return;
        }

        const medalhas = ["🥇", "🥈", "🥉"];
        participantes.slice(0, 5).forEach(function (participante, indice) {
            const item = document.createElement("p");
            item.className = "ranking-item";
            item.textContent =
                (medalhas[indice] || "⭐") + " " + participante.nome +
                " — " + participante.pontos + " pontos";
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro ao carregar ranking:", erro);
        lista.textContent = "Não foi possível carregar o ranking agora.";
    }
}


// ==========================================
// SAIR
// ==========================================

async function sair() {
    try {
        if (auth) {
            await auth.signOut();
        }
    } catch (erro) {
        console.error("Erro ao encerrar sessão:", erro);
    }

    localStorage.removeItem("usuarioLogado");

    if (modalPerfil) {
        modalPerfil.style.display = "none";
    }

    if (btnLogin) {
        btnLogin.innerHTML = "👤 Entrar";
    }

    window.location.reload();
}


// ==========================================
// EXCLUIR CONTA
// ==========================================

async function excluirConta() {
    if (typeof Swal === "undefined") {
        return;
    }

    const resultado = await Swal.fire({
        title: "Excluir conta?",
        html: montarConteudoAlertaLibras(
            "Seu cadastro, seu progresso e seus comentários serão apagados permanentemente."
        ),
        icon: "warning",

        showCancelButton: true,

        confirmColor: "#d33",
        cancelColor: "#3085d6",

        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) {
        return;
    }

    try {
        const usuario = await aguardarUsuarioFirebase();

        if (!auth || !usuario) {
            exibirAlerta(
                "warning",
                "Sessão não encontrada",
                "Não foi possível localizar a conta conectada."
            );

            return;
        }

        await apagarColecaoEmLotes(
            db.collection("usuarios").doc(usuario.uid).collection("resultados")
        );
        await apagarColecaoEmLotes(
            db.collection("usuarios").doc(usuario.uid).collection("atividades")
        );
        await apagarColecaoEmLotes(
            db.collection("usuarios").doc(usuario.uid).collection("acessos")
        );
        await apagarConsultaEmLotes(
            db.collection("comentarios").where("usuarioId", "==", usuario.uid)
        );

        await db
            .collection("usuarios")
            .doc(usuario.uid)
            .delete();

        await usuario.delete();

        [
            "progressoCursoPotenciacao",
            "progressoCursoRadiciacao",
            "resultadosPotenciacao",
            "resultadosRadiciacao"
        ].forEach(function (chaveBase) {
            localStorage.removeItem(chaveBase);
            localStorage.removeItem(chaveBase + "_" + usuario.uid);
        });
        localStorage.removeItem("usuarioLogado");

        await Swal.fire({
            icon: "success",
            title: "Conta excluída",
            html: montarConteudoAlertaLibras("Seu cadastro foi removido."),
            timer: 1500,
            showConfirmButton: false
        });

        window.location.reload();

    } catch (erro) {
        console.error("Erro ao excluir conta:", erro);

        if (erro.code === "auth/requires-recent-login") {
            exibirAlerta(
                "warning",
                "Confirmação de segurança necessária",
                "O Firebase bloqueou a exclusão porque esta sessão é antiga. Entre novamente e repita somente nesse caso."
            );

            return;
        }

        exibirAlerta(
            "error",
            "Erro ao excluir",
            traduzirErroFirebase(erro.code)
        );
    }
}

function aguardarUsuarioFirebase() {
    if (!auth) return Promise.resolve(null);
    if (auth.currentUser) return Promise.resolve(auth.currentUser);

    return new Promise(function (resolve) {
        let finalizado = false;
        const encerrar = function (usuario) {
            if (finalizado) return;
            finalizado = true;
            resolve(usuario || null);
        };
        const cancelarObservacao = auth.onAuthStateChanged(function (usuario) {
            cancelarObservacao();
            encerrar(usuario);
        });
        setTimeout(function () {
            cancelarObservacao();
            encerrar(auth.currentUser);
        }, 3000);
    });
}

async function apagarColecaoEmLotes(referenciaColecao) {
    await apagarConsultaEmLotes(referenciaColecao.limit(400));
}

async function apagarConsultaEmLotes(consulta) {
    let resultado = await consulta.get();

    while (!resultado.empty) {
        const lote = db.batch();
        resultado.docs.forEach(function (documento) {
            lote.delete(documento.ref);
        });
        await lote.commit();
        resultado = await consulta.get();
    }
}


// ==========================================
// MOSTRAR E OCULTAR SENHA
// ==========================================

function alternarSenha(idCampo, icone) {
    const campo = document.getElementById(idCampo);

    if (!campo) {
        return;
    }

    if (campo.type === "password") {
        campo.type = "text";
        icone.innerHTML = "🙈";
        icone.setAttribute("aria-label", "Ocultar senha");
        icone.title = "Ocultar senha";

    } else {
        campo.type = "password";
        icone.innerHTML = "👁️";
        icone.setAttribute("aria-label", "Mostrar senha");
        icone.title = "Mostrar senha";
    }
}


// ==========================================
// RECUPERAR SENHA
// ==========================================

async function esqueceuSenha(evento) {
    if (evento) {
        evento.preventDefault();
    }

    if (!auth) {
        exibirAlerta(
            "error",
            "Erro",
            "O Firebase não está disponível."
        );

        return;
    }

    let email = "";

    const campoEmail =
        document.getElementById("loginEmail");

    if (campoEmail) {
        email = campoEmail.value.trim().toLowerCase();
    }

    if (typeof Swal === "undefined") {
        if (!email) {
            email = prompt(
                "Digite o e-mail usado no cadastro:"
            );
        }

        if (!email) {
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);

            alert(
                "O link de redefinição foi enviado para seu e-mail."
            );

        } catch (erro) {
            alert(traduzirErroFirebase(erro.code));
        }

        return;
    }

    const resultado = await Swal.fire({
        title: "Recuperar senha",

        text:
            "Informe o e-mail usado no cadastro para receber " +
            "o link de redefinição.",

        input: "email",
        inputValue: email,

        inputPlaceholder: "seuemail@exemplo.com",

        showCancelButton: true,

        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",

        inputValidator: function (valor) {
            if (!valor) {
                return "Informe seu e-mail.";
            }
        }
    });

    if (!resultado.isConfirmed) {
        return;
    }

    try {
        await auth.sendPasswordResetEmail(
            resultado.value.trim().toLowerCase()
        );

        exibirAlerta(
            "success",
            "E-mail enviado",
            "Confira sua caixa de entrada e a pasta de spam."
        );

    } catch (erro) {
        console.error(
            "Erro ao enviar recuperação de senha:",
            erro
        );

        exibirAlerta(
            "error",
            "Não foi possível enviar",
            traduzirErroFirebase(erro.code)
        );
    }
}


// ==========================================
// LIMPAR FORMULÁRIOS
// ==========================================

function limparFormularioLogin() {
    const formulario =
        document.getElementById("formLogin");

    if (formulario) {
        formulario.reset();
    }
}

function limparFormularioCadastro() {
    const formulario =
        document.getElementById("formCadastro");

    if (formulario) {
        formulario.reset();
    }
}


// ==========================================
// PESQUISA
// ==========================================

function pesquisarConteudo() {
    const campo =
        document.getElementById("campoPesquisa");

    if (!campo) {
        return;
    }

    const pesquisa =
        campo.value.trim().toLowerCase();

    const cards =
        document.querySelectorAll(".card");

    cards.forEach(function (card) {
        const nome =
            card.dataset.nome
                ? card.dataset.nome.toLowerCase()
                : "";

        card.style.display =
            nome.includes(pesquisa)
                ? "block"
                : "none";
    });
}


// ==========================================
// ABRIR JOGOS
// ==========================================

function abrirJogo(tipo) {
    const paginas = {
        potencia: "jogo_potencia.html",
        radiciacao: "jogoradiciacao.html",
        planocartesiano: "planocartesiano.html"
    };

    if (paginas[tipo]) {
        window.location.href = paginas[tipo];
    }
}


// ==========================================
// VOLTAR PÁGINA
// ==========================================

function voltarPagina() {
    history.back();
}


// ==========================================
// ALERTAS
// ==========================================

function exibirAlerta(
    icon,
    title,
    text,
    timer = null,
    callback = null
) {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: icon,
            title: title,
            html: montarConteudoAlertaLibras(text),
            timer: timer,
            showConfirmButton: !timer
        }).then(function () {
            if (callback) {
                callback();
            }
        });

    } else {
        alert(title + ": " + text);

        if (callback) {
            callback();
        }
    }
}

function escaparHtml(valor) {
    const elemento = document.createElement("div");
    elemento.textContent = String(valor || "");
    return elemento.innerHTML;
}

function montarConteudoAlertaLibras(texto) {
    return (
        '<div class="alerta-conteudo-acessivel">' +
            '<div class="janela-libras-alerta" aria-label="Janela de tradução em Libras">' +
                '<span aria-hidden="true">🤟</span>' +
                '<strong>Janela de Libras</strong>' +
            '</div>' +
            '<p>' + escaparHtml(texto) + '</p>' +
        '</div>'
    );
}


// ==========================================
// TRADUZIR ERROS DO FIREBASE
// ==========================================

function traduzirErroFirebase(codigo) {
    switch (codigo) {
        case "auth/invalid-email":
            return "O e-mail informado é inválido.";

        case "auth/email-already-in-use":
            return (
                "Este e-mail já possui cadastro. " +
                "Entre usando seu e-mail e sua senha."
            );

        case "auth/weak-password":
            return "A senha deve ter pelo menos 6 caracteres.";

        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "E-mail ou senha incorretos.";

        case "auth/operation-not-allowed":
            return (
                "Ative o provedor E-mail/senha " +
                "no Firebase Authentication."
            );

        case "auth/too-many-requests":
            return (
                "Muitas tentativas foram realizadas. " +
                "Aguarde alguns minutos."
            );

        case "auth/network-request-failed":
            return (
                "Falha de conexão. Confira sua internet " +
                "e tente novamente."
            );

        case "auth/unauthorized-domain":
            return (
                "O domínio deste site não está autorizado " +
                "no Firebase Authentication."
            );

        case "auth/requires-recent-login":
            return (
                "Por segurança, saia e entre novamente " +
                "antes de realizar essa operação."
            );

        case "permission-denied":
            return (
                "O Firestore recusou o acesso. " +
                "Confira as regras do banco."
            );

        default:
            if (codigo) {
                return "O Firebase retornou o erro: " + codigo;
            }

            return (
                "Ocorreu um erro. Abra o Console do navegador " +
                "para conferir os detalhes."
            );
    }
}


// ==========================================
// EVENTOS DOS FORMULÁRIOS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        mostrarUsuario();
        atualizarPerfilLocal();
        atualizarContinuarEstudando();
        atualizarRankingPublico();

        const campoPesquisa =
            document.getElementById("campoPesquisa");

        if (campoPesquisa) {
            campoPesquisa.value = "";
        }

        const formLogin =
            document.getElementById("formLogin");

        if (formLogin) {
            formLogin.addEventListener(
                "submit",
                function (evento) {
                    evento.preventDefault();
                    login();
                }
            );
        }

        const formCadastro =
            document.getElementById("formCadastro");

        if (formCadastro) {
            formCadastro.addEventListener(
                "submit",
                function (evento) {
                    evento.preventDefault();
                    cadastrar();
                }
            );
        }
    }
);


// ==========================================
// ACOMPANHAR ESTADO DO FIREBASE
// ==========================================

if (auth) {
    auth.onAuthStateChanged(
        async function (usuarioFirebase) {
            if (!usuarioFirebase) {
                /*
                 * Não apagamos aqui imediatamente para evitar conflito
                 * durante o carregamento inicial. O botão será ajustado
                 * pela sessão local.
                 */
                return;
            }

            try {
                const documento = await db
                    .collection("usuarios")
                    .doc(usuarioFirebase.uid)
                    .get();

                if (!documento.exists) {
                    return;
                }

                const dados = documento.data();

                const sessao = {
                    uid: usuarioFirebase.uid,

                    nome:
                        dados.nome ||
                        usuarioFirebase.displayName ||
                        usuarioFirebase.email.split("@")[0],

                    email: usuarioFirebase.email,

                    pontos: dados.pontos || 0,
                    aulas: dados.aulas || 0,
                    jogos: dados.jogos || 0,
                    participarRanking:
                        Boolean(dados.participarRanking)
                };

                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(sessao)
                );

                mostrarUsuario();

            } catch (erro) {
                console.error(
                    "Erro ao recuperar sessão do usuário:",
                    erro
                );
            }
        }
    );
}


// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

window.addEventListener(
    "click",
    function (evento) {
        if (evento.target === modalLogin) {
            modalLogin.style.display = "none";
        }

        if (evento.target === modalCadastro) {
            modalCadastro.style.display = "none";
        }

        if (evento.target === modalPerfil) {
            modalPerfil.style.display = "none";
        }

        if (evento.target === modalTermos) {
            modalTermos.style.display = "none";
        }
    }
);

async function registrarAcessoUsuario(
    usuarioFirebase
) {
    if (!usuarioFirebase) {
        return;
    }

    /*
     * Impede que atualizar a página várias vezes
     * conte como vários acessos na mesma sessão.
     */

    const chaveDaSessao =
        "acessoRegistrado_" +
        usuarioFirebase.uid;

    if (
        sessionStorage.getItem(
            chaveDaSessao
        )
    ) {
        return;
    }

    const referenciaUsuario =
        db.collection("usuarios")
            .doc(usuarioFirebase.uid);

    try {
        await referenciaUsuario.set(
            {
                email:
                    usuarioFirebase.email ||
                    "",

                ultimoAcesso:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp(),

                quantidadeAcessos:
                    firebase.firestore
                        .FieldValue
                        .increment(1)
            },
            {
                merge: true
            }
        );

        await referenciaUsuario
            .collection("acessos")
            .add(
                {
                    entrouEm:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp(),

                    paginaInicial:
                        window.location.pathname,

                    dispositivo:
                        navigator.userAgent
                }
            );

        sessionStorage.setItem(
            chaveDaSessao,
            "true"
        );

    } catch (erro) {
        console.error(
            "Erro ao registrar acesso:",
            erro
        );
    }
}

if (auth) {
    auth.onAuthStateChanged(
        async function (usuarioFirebase) {
            if (!usuarioFirebase) {
                return;
            }

            await registrarAcessoUsuario(
                usuarioFirebase
            );
        }
    );
}

async function registrarVideoConcluido(
    tematica,
    etapa
) {
    const usuario =
        firebase.auth().currentUser;

    if (!usuario) {
        return;
    }

    const atividade = {
        tipo:
            "video_concluido",

        tematica:
            tematica,

        etapa:
            etapa,

        realizadoEm:
            firebase.firestore
                .FieldValue
                .serverTimestamp()
    };

    await db
        .collection("usuarios")
        .doc(usuario.uid)
        .collection("atividades")
        .add(atividade);
}
// ==========================================
// disciplina suspenso
// ==========================================
function myFunction() {
  var x = document.getElementById("menu-links");
  if (x.className === "menu-links") {
    x.className += " responsive";
  } else {
    x.className = "menu-links";
  }
}
