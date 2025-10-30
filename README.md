# Meu Projeto (Angular) — Guia Completo

Este projeto é uma aplicação Angular (standalone) com uma página Home que realiza CRUD de "Pessoas" (nome, CPF, telefone) utilizando um backend local com `json-server` que persiste os dados em `db.json`. O foco é demonstrar uma UI simples, máscaras de entrada (via `ngx-mask`), ícones (Tabler Icons), tipografia (Poppins) e um fluxo de edição com validação básica.

## Sumário

- Visão geral
- Requisitos
- Instalação e execução
- Scripts disponíveis
- Arquitetura e organização
- Persistência de dados (json-server)
- Serviço `PessoaService` (CRUD)
- Página Home (comportamento e fluxo)
- Componentes de UI (Input e Button)
- Estilos e design (SCSS)
- Ícones e tipografia
- SSR e considerações
- Testes e qualidade
- Problemas conhecidos e melhorias futuras

## Visão geral

- Framework: `Angular` com componentes standalone e configuração em `app.config.ts`.
- UI: página Home com formulário para adicionar pessoas e tabela para listar/editar/remover.
- Máscaras: `ngx-mask` para CPF e telefone, com máscara dinâmica de telefone.
- Persistência: `json-server` servindo `db.json` em `http://localhost:3001/pessoas`.
- Rede: `HttpClient` habilitado via `provideHttpClient()` em `app.config.ts`.
- Estilo: SCSS modular, com ajustes finos para alinhamento de botões e inputs.
- Ícones: Tabler Icons carregado via CDN confiável.
- Tipografia: Fonte Poppins via Google Fonts.

## Requisitos

- Node.js 18+ (recomendado 20+)
- NPM 9+
- Opcional: Angular CLI para utilitários (`npm i -g @angular/cli`)

## Instalação e execução

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Iniciar API local (json-server):
   ```bash
   npm run api
   ```
   - Endereço: `http://localhost:3001/`
   - Endpoint principal: `http://localhost:3001/pessoas`
3. Iniciar aplicação Angular:
   ```bash
   npm start
   ```
   - Endereço: `http://localhost:4200/`
4. Acessar a interface e validar operações CRUD.

## Scripts disponíveis

- `npm start`: inicia o servidor de desenvolvimento Angular em `http://localhost:4200/`.
- `npm run api`: inicia o `json-server`, observando `db.json` na porta `3001`.
- `npm run build`: gera build de produção (se configurado no `angular.json`).
- `npm test`: executa testes (se houver specs configuradas).

## Arquitetura e organização

Estrutura principal (resumo):

```
meu-projeto/
├── db.json                 # Banco JSON do json-server
├── package.json            # Scripts e dependências
├── src/
│   ├── app/                # Configuração e bootstrap
│   │   └── app.config.ts   # providers (HttpClient, mask, etc.)
│   ├── index.html          # HTML base (fonts, ícones)
│   ├── main.ts             # bootstrap do Angular
│   ├── presentation/       # páginas e componentes de UI
│   │   ├── pages/home/     # página Home (form + tabela)
│   │   └── components/form/
│   │       ├── input/      # input standalone (com máscara)
│   │       └── button/     # button standalone
│   ├── services/           # serviços (HttpClient)
│   │   └── pessoa.service.ts
│   └── types/              # tipos (interfaces)
└── ...
```

Pontos chave:
- `app.config.ts` inclui `provideHttpClient()` e configurações (`provideNgxMask`, `provideRouter`, etc.).
- `pessoa.service.ts` centraliza as chamadas HTTP para o backend.
- `home.component.ts` gerencia estado e interage com `PessoaService`.
- `home.module.scss` e `button.module.scss` ajustam espaçamento e alinhamento.

## Persistência de dados (json-server)

- Arquivo: `meu-projeto/db.json`
- Estrutura inicial:
  ```json
  {
    "pessoas": []
  }
  ```
- Endpoints:
  - `GET    /pessoas` — lista todas
  - `POST   /pessoas` — cria nova
  - `PATCH  /pessoas/:id` — atualiza parcial
  - `DELETE /pessoas/:id` — remove

Exemplos rápidos (cURL):
```bash
# Listar
curl http://localhost:3001/pessoas

# Adicionar
curl -X POST http://localhost:3001/pessoas \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Fulano","cpf":"123.456.789-09","telefone":"(11) 91234-5678"}'

# Atualizar
curl -X PATCH http://localhost:3001/pessoas/1 \
  -H 'Content-Type: application/json' \
  -d '{"telefone":"(11) 92345-6789"}'

# Remover
curl -X DELETE http://localhost:3001/pessoas/1
```

## Serviço `PessoaService` (CRUD)

- Arquivo: `src/services/pessoa.service.ts`
- Base URL: `http://localhost:3001/pessoas`
- Métodos:
  - `getAll(): Observable<Pessoa[]>`
  - `add(pessoa: Pessoa): Observable<Pessoa>`
  - `update(id: number, patch: Partial<Pessoa>): Observable<Pessoa>`
  - `remove(id: number): Observable<void>`
- Tipo `Pessoa`:
  ```ts
  export interface Pessoa {
    id?: number;
    nome: string;
    cpf: string;
    telefone: string;
  }
  ```

## Página Home (comportamento e fluxo)

- Carregamento inicial (`ngOnInit`): busca a lista via `PessoaService.getAll()`.
- Adicionar:
  - Validações básicas de `nome`, `cpf` e `telefone` (não-vazios, máscaras aplicadas).
  - Chama `PessoaService.add(...)` e atualiza a lista com a resposta (inclui `id`).
- Editar:
  - Clique em “editar” coloca a linha em modo edição; os campos tornam-se editáveis.
  - “Salvar” chama `PessoaService.update(id, patch)`, atualiza a linha e sai do modo edição.
  - “Cancelar” restaura os valores originais da linha e sai do modo edição.
- Remover:
  - Chama `PessoaService.remove(id)` e retira da lista local ao concluir.
- Máscara de telefone dinâmica:
  - Ao digitar, a máscara alterna entre fixo/celular conforme a quantidade de dígitos.
  - Em edição, a mesma lógica é aplicada por linha.

## Componentes de UI

### InputComponent
- Standalone, com suporte a `ControlValueAccessor` (modelo Angular de formulários).
- Integração com `ngx-mask` para CPF e telefone.
- Propriedades principais (podem variar conforme implementação):
  - `id`, `name`, `placeholder`, `type`, `inputmode`, `disabled`
  - `mask` (ex.: `CPF_CNPJ`, `phone`), `dropSpecialCharacters`
  - Eventos padrão: `input`, `change`

### ButtonComponent
- Standalone, estilos com variações (`btn`, `btn3`, `btn5`, etc.).
- Propriedades principais:
  - `label`, `type` (`button`/`submit`), `disabled`
  - `typeStyle` (variação de estilo)
  - `width` (quando aplicável)

## Estilos e design (SCSS)

- `home.module.scss`
  - Formulário usa `display: grid` com `gap` ajustado para melhor espaçamento.
  - Tabela com `vertical-align: middle` nas células para alinhar conteúdo.
  - Última coluna simplificada para melhor alinhamento dos botões.
- `button.module.scss`
  - Removidos `margin-top`/`margin-bottom` em variações de botão para eliminar deslocamentos verticais.
  - Resultado: botões (Adicionar, Salvar, Cancelar) alinhados com inputs e conteúdo da tabela.
- Organização de estilos global:
  - `index.html` importa Poppins e Tabler Icons.
  - Componentes consomem estilos locais (SCSS modular) e variáveis globais conforme padrão do projeto.

## Ícones e tipografia

- Poppins: importado no `index.html` via Google Fonts.
- Tabler Icons: importado via CDN (`cdn.jsdelivr.net`, versão `3.19.0`).
- Uso em HTML: classes `ti ti-<nome-do-ícone>` (ex.: `ti ti-edit`, `ti ti-trash`).

## SSR e considerações

- O projeto não depende de `localStorage` e usa exclusivamente o `HttpClient` para persistência.
- Caso utilize SSR (Angular Universal), o fluxo HTTP funciona sem alterações.
- Erros anteriores relacionados a `localStorage` foram removidos com a migração para `json-server`.

## Testes e qualidade

- Pode haver testes unitários para componentes (ex.: `input.component.spec.ts`).
- Recomenda-se adicionar testes para o `PessoaService` (mocks de `HttpClient`) e para o fluxo do `HomeComponent`.

## Problemas conhecidos e melhorias futuras

- Avisos de depreciação do Sass (`@import`): alguns estilos ainda usam `@import`. Futuramente migrar para `@use`/`@forward`.
- Validações de CPF/telefone são básicas; pode-se integrar validações formais (ex.: algoritmo de CPF).
- Feedback UX: adicionar estados de loading/erro visíveis nos botões e campos.
- Paginação e busca: a tabela atualmente lista tudo; pode-se adicionar filtros e paginação.

## Como explicar para outra pessoa

- É uma app Angular simples com CRUD de pessoas.
- O backend é simulado com `json-server`, persistindo em `db.json`.
- A página Home permite adicionar, editar e remover pessoas; usa máscaras para CPF e telefone.
- O serviço `PessoaService` faz requisições HTTP e atualiza o estado na UI.
- A UI foi ajustada para alinhamento consistente dos botões com inputs e linhas da tabela.

---

Se precisar de mais detalhes (ex.: APIs de componentes, opções de máscara, ou fluxos específicos), abra uma issue ou descreva o caso para expandirmos este guia.