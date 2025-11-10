# Página Home (Clientes) – Guia Simples

Este guia descreve, de forma simples, como funciona a página de Clientes.

## Visão Geral

- Exibe uma lista paginada de clientes com ordenação e busca.
- Permite adicionar, visualizar, editar e excluir clientes.
- Usa validações para CPF e telefone e mensagens claras de erro.

## Estrutura de Formulários

- `ClientForm`: Form de cliente com campos `id`, `nome`, `cpf`, `telefone`.
  - Validações:
    - `nome`: obrigatório.
    - `cpf`: obrigatório + `cpfValidator()` para formatar/validar 11 dígitos e impedir repetições.
    - `telefone`: obrigatório + `phoneValidator()` para aceitar 10 ou 11 dígitos.
- `SearchForm`: Form de busca com `filtros` e `content`.
  - `filtros`: seleciona o campo de ordenação (nome/cpf/telefone).
  - `content`: termo de busca.

## Tabela e Carregamento Lazy

- `p-table` com `lazy` carrega a lista via `loadItens($event)`.
- `loadItens` lê paginação, ordenação e filtros do evento e do `SearchForm` e chama `HomeService.getItems`.
- `loading` controla o estado de carregamento e exibe o overlay suave.

## Adicionar e Editar

- `addItem()`: abre o diálogo de novo cliente com o formulário limpo.
- `addItemAPI()`: cria o cliente via `HomeService.createItem` e, ao concluir, recarrega a listagem para refletir paginação/ordenação.
- `editItem(item)`: busca o cliente por `id`, popula o formulário e abre o diálogo editável.
- `updateItemAPI()`: atualiza o cliente e move-o para o topo da lista.

## Visualizar e Excluir

- `viewItem(id)`: busca e abre o diálogo em modo somente leitura.
- `messageConfirmDelete(item)`: confirma exclusão mostrando o nome do cliente.
- `excludeItem(id)`: remove o cliente do backend e atualiza a lista e o total.

## Validações e Mensagens

- Helpers:
  - `onlyDigits(value)`: remove caracteres não numéricos.
  - `formatCpf(value)`: formata CPF (###.###.###-##).
  - `formatPhone(value)`: formata telefone (DDD + número).
- Validador CPF: garante 11 dígitos e rejeita sequências repetidas.
- Validador Telefone: aceita 10 ou 11 dígitos.
- Mensagens no diálogo:
  - `CPF já cadastrado`: prioridade quando o backend indica duplicidade.
  - `CPF inválido` e `CPF é obrigatório`: exibidos quando apropriado.
  - Telefone: mostra “É necessário um número de telefone.” ou “Telefone inválido”.

## Serviço

- `HomeService` integra com a API REST (`/api/clientes`) para criar, listar, buscar, atualizar e excluir.

## Dicas

- Use o filtro e o termo para refinar a busca.
- Em caso de erro de servidor, as mensagens são aplicadas diretamente nos campos do formulário.
