const chaveArmazenamento = 'organizae-tarefas';
const formulario = document.querySelector('#form-tarefa');
const campoTitulo = document.querySelector('#titulo-tarefa');
const campoNota = document.querySelector('#nota-tarefa');
const botaoSalvar = document.querySelector('#botao-salvar');
const botaoCancelar = document.querySelector('#botao-cancelar');
const mensagem = document.querySelector('#mensagem');
const lista = document.querySelector('#lista-tarefas');
const estadoVazio = document.querySelector('#estado-vazio');
const tituloVazio = document.querySelector('#vazio-titulo');
const textoVazio = document.querySelector('#vazio-texto');
const botoesFiltro = document.querySelectorAll('[data-filtro]');
const contadorTotal = document.querySelector('#contador-total');
const contadorPendentes = document.querySelector('#contador-pendentes');
const contadorConcluidas = document.querySelector('#contador-concluidas');
let tarefas = carregarTarefas();
let filtroAtual = 'todas';
let idEmEdicao = null;
let proximoId = 1;
for (let indice = 0; indice < tarefas.length; indice += 1) {
  if (tarefas[indice].id >= proximoId) {
    proximoId = tarefas[indice].id + 1;
  }
}
function carregarTarefas() {
  const dadosSalvos = localStorage.getItem(chaveArmazenamento);
  if (dadosSalvos === null) {
    return [];
  }
  try {
    const tarefasSalvas = JSON.parse(dadosSalvos);
    if (Array.isArray(tarefasSalvas)) {
      return tarefasSalvas;
    }
  } catch (erro) {
    return [];
  }
  return [];
}
function salvarTarefas() {
  localStorage.setItem(chaveArmazenamento, JSON.stringify(tarefas));
}
function mostrarMensagem(texto) {
  mensagem.textContent = texto;
}
function criarBotao(texto, classe, descricao, acao) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = classe;
  botao.textContent = texto;
  botao.setAttribute('aria-label', descricao);
  botao.addEventListener('click', acao);
  return botao;
}
function obterTarefasVisiveis() {
  const tarefasVisiveis = [];
  for (let indice = 0; indice < tarefas.length; indice += 1) {
    const tarefa = tarefas[indice];
    if (filtroAtual === 'pendentes' && tarefa.concluida === false) {
      tarefasVisiveis[tarefasVisiveis.length] = tarefa;
    } else if (filtroAtual === 'concluidas' && tarefa.concluida === true) {
      tarefasVisiveis[tarefasVisiveis.length] = tarefa;
    } else if (filtroAtual === 'todas') {
      tarefasVisiveis[tarefasVisiveis.length] = tarefa;
    }
  }
  return tarefasVisiveis;
}
function atualizarContadores() {
  let concluidas = 0;
  for (let indice = 0; indice < tarefas.length; indice += 1) {
    if (tarefas[indice].concluida === true) {
      concluidas += 1;
    }
  }
  contadorTotal.textContent = tarefas.length;
  contadorConcluidas.textContent = concluidas;
  contadorPendentes.textContent = tarefas.length - concluidas;
}
function atualizarEstadoVazio(quantidadeVisivel) {
  if (quantidadeVisivel > 0) {
    estadoVazio.classList.add('oculto');
    return;
  }
  estadoVazio.classList.remove('oculto');
  if (tarefas.length === 0) {
    tituloVazio.textContent = 'Sua lista começa com uma ideia.';
    textoVazio.textContent = 'Adicione uma tarefa ali em cima e organize seu dia.';
  } else if (filtroAtual === 'pendentes') {
    tituloVazio.textContent = 'Tudo em dia por aqui!';
    textoVazio.textContent = 'Não há tarefas em andamento neste momento.';
  } else {
    tituloVazio.textContent = 'Ainda não há tarefas concluídas.';
    textoVazio.textContent = 'Quando terminar uma tarefa, marque o círculo ao lado dela.';
  }
}
function criarItemTarefa(tarefa) {
  const item = document.createElement('li');
  item.className = 'item-tarefa';
  if (tarefa.concluida) {
    item.classList.add('concluida');
  }
  const botaoConcluir = criarBotao(
    tarefa.concluida ? '✓' : '',
    'marcador-tarefa',
    tarefa.concluida ? 'Marcar tarefa como em andamento' : 'Marcar tarefa como concluída',
    function () { alternarConclusao(tarefa.id); }
  );
  const texto = document.createElement('div');
  texto.className = 'texto-tarefa';
  const titulo = document.createElement('p');
  titulo.className = 'titulo-item';
  titulo.textContent = tarefa.titulo;
  texto.appendChild(titulo);
  if (tarefa.nota) {
    const nota = document.createElement('p');
    nota.className = 'nota-item';
    nota.textContent = tarefa.nota;
    texto.appendChild(nota);
  }
  const acoes = document.createElement('div');
  acoes.className = 'acoes-tarefa';
  acoes.appendChild(criarBotao('Editar', 'botao-acao', 'Editar ' + tarefa.titulo, function () {
    iniciarEdicao(tarefa.id);
  }));
  acoes.appendChild(criarBotao('Excluir', 'botao-acao botao-excluir', 'Excluir ' + tarefa.titulo, function () {
    excluirTarefa(tarefa.id);
  }));
  item.appendChild(botaoConcluir);
  item.appendChild(texto);
  item.appendChild(acoes);
  return item;
}
function renderizarTarefas() {
  lista.innerHTML = '';
  const tarefasVisiveis = obterTarefasVisiveis();
  for (let indice = 0; indice < tarefasVisiveis.length; indice += 1) {
    lista.appendChild(criarItemTarefa(tarefasVisiveis[indice]));
  }
  atualizarContadores();
  atualizarEstadoVazio(tarefasVisiveis.length);
}
function limparFormulario() {
  formulario.reset();
  idEmEdicao = null;
  botaoSalvar.textContent = '＋ Adicionar tarefa';
  botaoCancelar.classList.add('oculto');
}
function atualizarFiltroSelecionado() {
  for (let indice = 0; indice < botoesFiltro.length; indice += 1) {
    const botao = botoesFiltro[indice];
    const selecionado = botao.getAttribute('data-filtro') === filtroAtual;
    botao.classList.toggle('ativo', selecionado);
    botao.setAttribute('aria-pressed', selecionado);
  }
}
function iniciarEdicao(id) {
  let tarefa;
  for (let indice = 0; indice < tarefas.length; indice += 1) {
    if (tarefas[indice].id === id) {
      tarefa = tarefas[indice];
    }
  }
  if (tarefa === undefined) {
    return;
  }
  idEmEdicao = id;
  campoTitulo.value = tarefa.titulo;
  campoNota.value = tarefa.nota;
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.classList.remove('oculto');
  mostrarMensagem('Editando sua tarefa. Faça as alterações e salve.');
  campoTitulo.focus();
}
function alternarConclusao(id) {
  for (let indice = 0; indice < tarefas.length; indice += 1) {
    if (tarefas[indice].id === id) {
      tarefas[indice].concluida = !tarefas[indice].concluida;
    }
  }
  salvarTarefas();
  renderizarTarefas();
  mostrarMensagem('Progresso atualizado.');
}
function excluirTarefa(id) {
  const tarefasAtualizadas = [];
  for (let indice = 0; indice < tarefas.length; indice += 1) {
    if (tarefas[indice].id !== id) {
      tarefasAtualizadas[tarefasAtualizadas.length] = tarefas[indice];
    }
  }
  tarefas = tarefasAtualizadas;
  if (idEmEdicao === id) {
    limparFormulario();
  }
  salvarTarefas();
  renderizarTarefas();
  mostrarMensagem('Tarefa excluída.');
}
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const titulo = campoTitulo.value.trim();
  const nota = campoNota.value.trim();
  if (titulo === '') {
    mostrarMensagem('Escreva o nome da tarefa antes de salvar.');
    campoTitulo.focus();
    return;
  }
  if (idEmEdicao !== null) {
    for (let indice = 0; indice < tarefas.length; indice += 1) {
      if (tarefas[indice].id === idEmEdicao) {
        tarefas[indice].titulo = titulo;
        tarefas[indice].nota = nota;
      }
    }
    limparFormulario();
    mostrarMensagem('Alterações salvas.');
  } else {
    tarefas[tarefas.length] = { id: proximoId, titulo: titulo, nota: nota, concluida: false };
    proximoId += 1;
    formulario.reset();
    filtroAtual = 'todas';
    atualizarFiltroSelecionado();
    mostrarMensagem('Tarefa adicionada à sua lista.');
  }
  salvarTarefas();
  renderizarTarefas();
});
botaoCancelar.addEventListener('click', function () {
  limparFormulario();
  mostrarMensagem('Edição cancelada.');
});
botoesFiltro.forEach(function (botao) {
  botao.addEventListener('click', function () {
    filtroAtual = botao.getAttribute('data-filtro');
    atualizarFiltroSelecionado();
    renderizarTarefas();
  });
});
renderizarTarefas();