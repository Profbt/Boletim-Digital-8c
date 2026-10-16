/* =========================================================
   BOLETIM DIGITAL — 8º ANO
   Turma 8C — Nº 42
   ========================================================= */

/* -------- CONFIGURAÇÃO FIXA DO ALUNO -------- */
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 42,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* -------- DADOS BRUTOS (fallback local) --------
   tri1 = 1º trimestre
   tri2 = 2º trimestre
   tri3 = 3º trimestre (ainda não lançado => null)
   faltas = [1º tri, 2º tri, 3º tri] */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa",           tri1: 78, tri2: 15,  tri3: null, faltas: [5, 7, 0] },
  { disciplina: "Matemática",                  tri1: 75, tri2: 51,  tri3: null, faltas: [6, 8, 0] },
  { disciplina: "Ciências",                    tri1: 75, tri2: 25,  tri3: null, faltas: [2, 5, 0] },
  { disciplina: "História",                    tri1: 75, tri2: 98,  tri3: null, faltas: [9, 1, 0] },
  { disciplina: "Geografia",                   tri1: 75, tri2: 68,  tri3: null, faltas: [8, 3, 0] },
  { disciplina: "Língua Inglesa",              tri1: 75, tri2: 75,  tri3: null, faltas: [4, 8, 0] },
  { disciplina: "Arte",                        tri1: 75, tri2: 84,  tri3: null, faltas: [65, 50, 0] },
  { disciplina: "Educação Física",             tri1: 75, tri2: 98,  tri3: null, faltas: [8, 65, 0] },
  { disciplina: "Educação Digital",            tri1: 75, tri2: 100, tri3: null, faltas: [45, 8, 0] },
  { disciplina: "Educação Financeira",         tri1: 75, tri2: 59,  tri3: null, faltas: [5, 5, 0] },
  { disciplina: "Estudo Orientado",            tri1: 75, tri2: 65,  tri3: null, faltas: [2, 6, 0] },
  { disciplina: "Redação e Leitura",           tri1: 75, tri2: 77,  tri3: null, faltas: [3, 2, 0] },
  { disciplina: "Pensamento Lógico",           tri1: 75, tri2: 72,  tri3: null, faltas: [0, 3, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 78, tri2: 88,  tri3: null, faltas: [1, 2, 0] },
  { disciplina: "Práticas Experimentais",      tri1: 55, tri2: 71,  tri3: null, faltas: [4, 1, 0] }
];

/* Frequência fictícia apenas para demonstração.
   No futuro esse valor será calculado de outra forma. */
const FREQUENCIA_DEMONSTRATIVA = 92;

/* -------- ESTADO DA SESSÃO -------- */
let pinSessao = null;              // guardado apenas em memória
let disciplinasAtuais = [];        // dados em uso (locais ou da API)
let modoEdicao = false;            // controla se a tabela está em edição

/* -------- FUNÇÃO: normalizarNota (dados antigos) --------
   Aceita 75, 82, 100, "8,5", 8.5, null. */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".").trim();
  }

  const numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

/* -------- FUNÇÃO: validarNotaDigitada --------
   Regra do editor: aceita 0–10, ponto ou vírgula, ou vazio.
   Retorna { ok: true, valor } ou { ok: false }. */
function validarNotaDigitada(texto) {
  const limpo = String(texto).trim();

  if (limpo === "") {
    return { ok: true, valor: null };
  }

  const normalizado = limpo.replace(",", ".");
  const numero = Number(normalizado);

  if (isNaN(numero)) {
    return { ok: false };
  }

  if (numero < 0 || numero > 10) {
    return { ok: false };
  }

  return { ok: true, valor: numero };
}

/* -------- FUNÇÃO: validarFaltasDigitadas --------
   Aceita inteiro >= 0. */
function validarFaltasDigitadas(texto) {
  const limpo = String(texto).trim();

  if (limpo === "") {
    return { ok: false };
  }

  if (!/^\d+$/.test(limpo)) {
    return { ok: false };
  }

  const numero = Number(limpo);

  if (!Number.isInteger(numero) || numero < 0) {
    return { ok: false };
  }

  return { ok: true, valor: numero };
}

/* -------- FUNÇÃO: calcularMedia -------- */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* -------- FUNÇÃO: definirSituacao -------- */
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "situacao-neutra" };
  }
  if (media >= 6) {
    return { texto: "Bom desempenho", classe: "situacao-bom" };
  }
  return { texto: "Atenção", classe: "situacao-atencao" };
}

/* -------- FUNÇÃO: formatarNota -------- */
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

/* -------- FUNÇÃO: prepararDisciplinas --------
   Converte dados brutos (locais ou da API) em dados processados. */
function prepararDisciplinas(lista) {
  return lista.map((item) => {
    const tri1 = normalizarNota(item.tri1);
    const tri2 = normalizarNota(item.tri2);
    const tri3 = normalizarNota(item.tri3);

    const faltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    const media = calcularMedia([tri1, tri2, tri3]);
    const totalFaltas = faltas.reduce((acc, f) => acc + (Number(f) || 0), 0);
    const situacao = definirSituacao(media);

    return {
      disciplina: item.disciplina,
      tri1,
      tri2,
      tri3,
      faltas: [faltas[0] || 0, faltas[1] || 0, faltas[2] || 0],
      media,
      totalFaltas,
      situacao
    };
  });
}

/* -------- FUNÇÃO: limparArea -------- */
function limparArea(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

/* -------- FUNÇÃO: montarTabela -------- */
function montarTabela() {
  const corpo = document.getElementById("corpoTabela");
  limparArea(corpo);

  disciplinasAtuais.forEach((d, indice) => {
    const linha = document.createElement("tr");

    // Disciplina (sempre texto seguro)
    const tdDisciplina = document.createElement("td");
    tdDisciplina.textContent = d.disciplina;
    linha.appendChild(tdDisciplina);

    // Notas e faltas (view ou edição)
    const campos = [
      { tipo: "nota", tri: 0, valor: d.tri1 },
      { tipo: "nota", tri: 1, valor: d.tri2 },
      { tipo: "nota", tri: 2, valor: d.tri3 },
      { tipo: "media", valor: d.media },
      { tipo: "faltas", valor: d.totalFaltas },
      { tipo: "situacao", valor: d.situacao }
    ];

    campos.forEach((campo) => {
      const td = document.createElement("td");

      if (modoEdicao && campo.tipo === "nota") {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "campo-edicao";
        input.dataset.indice = indice;
        input.dataset.tri = campo.tri;
        input.dataset.tipoCampo = "nota";
        input.value = campo.valor === null ? "" : formatarNota(campo.valor);
        td.appendChild(input);
      } else if (modoEdicao && campo.tipo === "faltas") {
        // Mostrar três campos: faltas 1, 2 e 3
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.gap = "4px";

        [0, 1, 2].forEach((i) => {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "campo-edicao";
          input.dataset.indice = indice;
          input.dataset.tri = i;
          input.dataset.tipoCampo = "faltas";
          input.value = String(d.faltas[i] ?? 0);
          wrapper.appendChild(input);
        });

        td.appendChild(wrapper);
      } else if (campo.tipo === "media") {
        const strong = document.createElement("strong");
        strong.textContent = formatarNota(campo.valor);
        td.appendChild(strong);
      } else if (campo.tipo === "faltas") {
        td.textContent = String(campo.valor);
      } else if (campo.tipo === "situacao") {
        const span = document.createElement("span");
        span.className = "situacao " + campo.valor.classe;
        span.textContent = campo.valor.texto;
        td.appendChild(span);
      } else {
        td.textContent = formatarNota(campo.valor);
      }

      linha.appendChild(td);
    });

    corpo.appendChild(linha);
  });
}

/* -------- FUNÇÃO: montarCards -------- */
function montarCards() {
  const container = document.getElementById("cardsResumo");
  limparArea(container);

  const mediasValidas = disciplinasAtuais
    .map((d) => d.media)
    .filter((m) => m !== null);

  const mediaGeral =
    mediasValidas.length > 0
      ? mediasValidas.reduce((acc, m) => acc + m, 0) / mediasValidas.length
      : null;

  const totalFaltas = disciplinasAtuais.reduce(
    (acc, d) => acc + d.totalFaltas,
    0
  );

  const bomDesempenho = disciplinasAtuais.filter(
    (d) => d.situacao.texto === "Bom desempenho"
  ).length;

  const atencao = disciplinasAtuais.filter(
    (d) => d.situacao.texto === "Atenção"
  ).length;

  const cards = [
    {
      titulo: "Média geral",
      valor: mediaGeral !== null ? formatarNota(mediaGeral) : "—",
      descricao: "Média das disciplinas com nota lançada",
      verde: true
    },
    {
      titulo: "Total de faltas",
      valor: totalFaltas,
      descricao: "Soma das faltas nos três trimestres",
      verde: false
    },
    {
      titulo: "Bom desempenho",
      valor: bomDesempenho,
      descricao: "Disciplinas com média ≥ 6,0",
      verde: true
    },
    {
      titulo: "Precisam de atenção",
      valor: atencao,
      descricao: "Disciplinas com média < 6,0",
      verde: false
    },
    {
      titulo: "Frequência",
      valor: FREQUENCIA_DEMONSTRATIVA + "%",
      descricao: "Frequência adequada (demonstrativa)",
      verde: true
    }
  ];

  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "card" + (c.verde ? " card-verde" : "");

    const pTitulo = document.createElement("p");
    pTitulo.className = "card-titulo";
    pTitulo.textContent = c.titulo;

    const pValor = document.createElement("p");
    pValor.className = "card-valor";
    pValor.textContent = String(c.valor);

    const pDescricao = document.createElement("p");
    pDescricao.className = "card-descricao";
    pDescricao.textContent = c.descricao;

    div.appendChild(pTitulo);
    div.appendChild(pValor);
    div.appendChild(pDescricao);

    container.appendChild(div);
  });
}

/* -------- FUNÇÃO: atualizarTela -------- */
function atualizarTela() {
  montarCards();
  montarTabela();
}

/* -------- FUNÇÃO: mostrarMensagem -------- */
function mostrarMensagem(id, texto, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = el.className.replace(
    /mensagem-(erro|ok|info)/g,
    ""
  ).trim();
  if (tipo) el.classList.add("mensagem-" + tipo);
}

/* -------- FUNÇÃO: abrirBoletim -------- */
async function abrirBoletim(pin) {
  const url = CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir";

  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pin
    })
  });

  if (resposta.status === 401) {
    const erro = new Error("nao_autorizado");
    erro.codigo = 401;
    throw erro;
  }

  if (resposta.status === 429) {
    const erro = new Error("muitas_tentativas");
    erro.codigo = 429;
    throw erro;
  }

  if (!resposta.ok) {
    const erro = new Error("falha_servidor");
    erro.codigo = resposta.status;
    throw erro;
  }

  return resposta.json();
}

/* -------- FUNÇÃO: salvarBoletim -------- */
async function salvarBoletim(dados) {
  const url = CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar";

  const resposta = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turma: CONFIG_ALUNO.turma,
      numero_chamada: CONFIG_ALUNO.numeroChamada,
      pin: pinSessao,
      dados: dados
    })
  });

  if (!resposta.ok) {
    const erro = new Error("falha_salvar");
    erro.codigo = resposta.status;
    throw erro;
  }

  return resposta.json().catch(() => ({}));
}

/* -------- FUNÇÃO: entrar -------- */
async function entrar() {
  const campoPin = document.getElementById("campoPin");
  const botao = document.getElementById("botaoEntrar");
  const pin = campoPin.value.trim();

  if (pin === "") {
    mostrarMensagem("mensagemPin", "Digite seu PIN.", "erro");
    return;
  }

  botao.disabled = true;
  mostrarMensagem("mensagemPin", "Conectando...", "info");

  try {
    const resultado = await abrirBoletim(pin);

    pinSessao = pin; // guardado apenas em memória
    campoPin.value = ""; // limpa o campo após login

    // DADOS DA API > DADOS LOCAIS
    const dadosDaApi =
      resultado && resultado.dados && Array.isArray(resultado.dados.disciplinas)
        ? resultado.dados.disciplinas
        : null;

    const lista =
      dadosDaApi && dadosDaApi.length > 0 ? dadosDaApi : dadosBrutos;

    disciplinasAtuais = prepararDisciplinas(lista);

    // Troca de telas
    document.getElementById("areaPin").hidden = true;
    document.getElementById("areaBoletim").hidden = false;

    atualizarTela();
  } catch (e) {
    if (e.codigo === 401) {
      mostrarMensagem(
        "mensagemPin",
        "Turma, chamada ou PIN inválidos.",
        "erro"
      );
    } else if (e.codigo === 429) {
      mostrarMensagem(
        "mensagemPin",
        "Muitas tentativas. Aguarde um minuto e tente novamente.",
        "erro"
      );
    } else {
      mostrarMensagem(
        "mensagemPin",
        "Não foi possível conectar ao servidor. Tente novamente.",
        "erro"
      );
    }
  } finally {
    botao.disabled = false;
  }
}

/* -------- FUNÇÃO: iniciarEdicao -------- */
function iniciarEdicao() {
  modoEdicao = true;
  document.getElementById("botaoEditar").hidden = true;
  document.getElementById("botaoSalvar").hidden = false;
  document.getElementById("botaoCancelar").hidden = false;
  mostrarMensagem("mensagemAcao", "Modo edição ativado.", "info");
  montarTabela();
}

/* -------- FUNÇÃO: cancelarEdicao -------- */
function cancelarEdicao() {
  modoEdicao = false;
  document.getElementById("botaoEditar").hidden = false;
  document.getElementById("botaoSalvar").hidden = true;
  document.getElementById("botaoCancelar").hidden = true;
  mostrarMensagem("mensagemAcao", "Edição cancelada.", "info");
  montarTabela();
}

/* -------- FUNÇÃO: lerCamposEditados --------
   Lê inputs da tabela, valida e monta a lista para salvar. */
function lerCamposEditados() {
  const inputs = document.querySelectorAll("#corpoTabela .campo-edicao");
  const erros = [];
  const porIndice = {};

  inputs.forEach((input) => {
    input.classList.remove("campo-invalido");

    const indice = Number(input.dataset.indice);
    const tri = Number(input.dataset.tri);
    const tipoCampo = input.dataset.tipoCampo;
    const valorTexto = input.value;

    if (!porIndice[indice]) {
      porIndice[indice] = {
        disciplina: disciplinasAtuais[indice].disciplina,
        notas: [null, null, null],
        faltas: [0, 0, 0]
      };
    }

    if (tipoCampo === "nota") {
      const r = validarNotaDigitada(valorTexto);
      if (!r.ok) {
        input.classList.add("campo-invalido");
        erros.push("Nota inválida em " + disciplinasAtuais[indice].disciplina + ".");
      } else {
        porIndice[indice].notas[tri] = r.valor;
      }
    } else if (tipoCampo === "faltas") {
      const r = validarFaltasDigitadas(valorTexto);
      if (!r.ok) {
        input.classList.add("campo-invalido");
        erros.push("Faltas inválidas em " + disciplinasAtuais[indice].disciplina + ".");
      } else {
        porIndice[indice].faltas[tri] = r.valor;
      }
    }
  });

  return { porIndice, erros };
}

/* -------- FUNÇÃO: salvarAlteracoes -------- */
async function salvarAlteracoes() {
  const { porIndice, erros } = lerCamposEditados();

  if (erros.length > 0) {
    mostrarMensagem(
      "mensagemAcao",
      "Corrija os campos inválidos antes de salvar.",
      "erro"
    );
    return;
  }

  // Monta lista final com todas as disciplinas
  const listaFinal = disciplinasAtuais.map((d, indice) => {
    const editado = porIndice[indice];
    return {
      disciplina: d.disciplina,
      tri1: editado ? editado.notas[0] : d.tri1,
      tri2: editado ? editado.notas[1] : d.tri2,
      tri3: editado ? editado.notas[2] : d.tri3,
      faltas: editado ? editado.faltas : d.faltas
    };
  });

  const botao = document.getElementById("botaoSalvar");
  botao.disabled = true;
  mostrarMensagem("mensagemAcao", "Salvando...", "info");

  try {
    await salvarBoletim({ disciplinas: listaFinal });

    disciplinasAtuais = prepararDisciplinas(listaFinal);

    modoEdicao = false;
    document.getElementById("botaoEditar").hidden = false;
    document.getElementById("botaoSalvar").hidden = true;
    document.getElementById("botaoCancelar").hidden = true;

    atualizarTela();
    mostrarMensagem("mensagemAcao", "Dados salvos com sucesso.", "ok");
  } catch (e) {
    mostrarMensagem(
      "mensagemAcao",
      "Não foi possível salvar. Tente novamente.",
      "erro"
    );
  } finally {
    botao.disabled = false;
  }
}

/* -------- LIGAÇÕES DE EVENTOS -------- */
document.getElementById("botaoEntrar").addEventListener("click", entrar);
document.getElementById("botaoEditar").addEventListener("click", iniciarEdicao);
document.getElementById("botaoCancelar").addEventListener("click", cancelarEdicao);
document.getElementById("botaoSalvar").addEventListener("click", salvarAlteracoes);

document.getElementById("campoPin").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    entrar();
  }
});