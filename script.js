/* =========================================================
   BOLETIM DIGITAL — 8º ANO
   Dados fictícios apenas para demonstração.
   ========================================================= */

/* -------- CONCEITOS RÁPIDOS --------
   - Variável: uma "caixinha" que guarda um valor (ex: const nome = "Ana").
   - Array: uma lista de valores (ex: [1, 2, 3]).
   - Objeto: um conjunto de informações com nomes (ex: { disciplina: "Matemática", nota: 8 }).
   - Função: um bloco de código que faz uma tarefa e pode ser reutilizado.
   - if: uma decisão ("se isso for verdade, faça aquilo").
   - forEach: percorre cada item de uma lista.
   - DOM: é a página HTML vista pelo JavaScript, que podemos modificar.
------------------------------------- */

/* -------- DADOS BRUTOS (fictícios) -------- */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

/* Frequência fictícia apenas para demonstração.
   No futuro esse valor será calculado de outra forma. */
const FREQUENCIA_DEMONSTRATIVA = 92;

/* -------- FUNÇÃO: normalizarNota --------
   Converte qualquer nota para a escala 0–10.
   - Vazio, null ou undefined => nota ausente.
   - Entre 0 e 10 => fica igual.
   - Maior que 10 e até 100 => divide por 10.
   - Aceita ponto ou vírgula. */
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".").trim();
  }

  const numero = Number(valor);

  // Se não for número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Regras de conversão
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras => inválido
  return null;
}

/* -------- FUNÇÃO: calcularMedia --------
   Calcula a média usando SOMENTE as notas disponíveis.
   Se não houver nenhuma nota, retorna null. */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);

  if (validas.length === 0) {
    return null;
  }

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* -------- FUNÇÃO: definirSituacao --------
   Decide a situação a partir da média.
   - null => "Nota ainda não disponível"
   - >= 6 => "Bom desempenho"
   - < 6 => "Atenção" */
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "situacao-neutra" };
  }
  if (media >= 6) {
    return { texto: "Bom desempenho", classe: "situacao-bom" };
  }
  return { texto: "Atenção", classe: "situacao-atencao" };
}

/* -------- FUNÇÃO: formatarNota --------
   Mostra a nota com 1 casa decimal ou "—" se ausente. */
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

/* -------- PROCESSAR DISCIPLINAS --------
   Para cada disciplina, normaliza as notas, calcula a média
   e soma as faltas. */
const disciplinasProcessadas = dadosBrutos.map((item) => {
  const tri1 = normalizarNota(item.tri1);
  const tri2 = normalizarNota(item.tri2);
  const tri3 = normalizarNota(item.tri3);

  const media = calcularMedia([tri1, tri2, tri3]);
  const totalFaltas = item.faltas.reduce((acc, f) => acc + f, 0);
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    tri1,
    tri2,
    tri3,
    media,
    totalFaltas,
    situacao
  };
});

/* -------- MONTAR A TABELA -------- */
function montarTabela() {
  const corpo = document.getElementById("corpoTabela");

  // forEach percorre cada disciplina da lista
  disciplinasProcessadas.forEach((d) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${d.disciplina}</td>
      <td>${formatarNota(d.tri1)}</td>
      <td>${formatarNota(d.tri2)}</td>
      <td>${formatarNota(d.tri3)}</td>
      <td><strong>${formatarNota(d.media)}</strong></td>
      <td>${d.totalFaltas}</td>
      <td><span class="situacao ${d.situacao.classe}">${d.situacao.texto}</span></td>
    `;

    corpo.appendChild(linha);
  });
}

/* -------- MONTAR OS CARDS DE RESUMO -------- */
function montarCards() {
  const container = document.getElementById("cardsResumo");

  // Média geral da escola (somente notas disponíveis)
  const mediasValidas = disciplinasProcessadas
    .map((d) => d.media)
    .filter((m) => m !== null);

  const mediaGeral =
    mediasValidas.length > 0
      ? mediasValidas.reduce((acc, m) => acc + m, 0) / mediasValidas.length
      : null;

  // Total de faltas
  const totalFaltas = disciplinasProcessadas.reduce(
    (acc, d) => acc + d.totalFaltas,
    0
  );

  // Disciplinas com bom desempenho e com atenção
  const bomDesempenho = disciplinasProcessadas.filter(
    (d) => d.situacao.texto === "Bom desempenho"
  ).length;

  const atencao = disciplinasProcessadas.filter(
    (d) => d.situacao.texto === "Atenção"
  ).length;

  // Lista de cards
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

  // Cria cada card no HTML
  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "card" + (c.verde ? " card-verde" : "");

    div.innerHTML = `
      <p class="card-titulo">${c.titulo}</p>
      <p class="card-valor">${c.valor}</p>
      <p class="card-descricao">${c.descricao}</p>
    `;

    container.appendChild(div);
  });
}

/* -------- INICIAR TUDO -------- */
montarCards();
montarTabela();