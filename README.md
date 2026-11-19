# Organizaê

Aplicação de lista de tarefas feita para o trabalho prático individual da disciplina de Desenvolvimento Web. O Organizaê ajuda a anotar tarefas, acompanhar o que está em andamento e registrar as pequenas conquistas do dia.

## Funcionalidades

- Adicionar tarefas com um detalhe opcional.
- Editar e excluir tarefas.
- Marcar tarefas como concluídas ou em andamento.
- Filtrar a lista por todas, em andamento ou concluídas.
- Ver contadores atualizados automaticamente.
- Manter as tarefas salvas no navegador com `localStorage`.
- Usar a interface em telas grandes ou pequenas.

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador.
3. Adicione uma tarefa pelo formulário. As tarefas ficam salvas no navegador e na mesma origem usada para abrir o projeto.

## Tecnologias

- HTML5 para estruturar a página e o formulário.
- CSS3 para cores, espaçamento, seletores, Flexbox, transições e adaptação de tela com `@media`.
- JavaScript puro para variáveis, funções, condicionais, arrays, objetos, eventos e atualização do DOM.
- `localStorage` para persistir a lista no navegador.
- Git e GitHub para controlar e publicar o projeto.

## Decisões de implementação

As tarefas são representadas como objetos dentro de um array. As funções atualizam essa lista e redesenham os itens no DOM. O formulário é usado tanto para cadastrar quanto para editar; durante a edição, os campos recebem os valores atuais e o botão de cancelar encerra essa ação. Os filtros mostram todas as tarefas, apenas as que ainda estão em andamento ou apenas as concluídas. Os dados são convertidos para texto JSON antes de serem guardados no `localStorage` e convertidos de volta quando a página é aberta.