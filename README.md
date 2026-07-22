# Estoque — Controle de Estoque para Loja de Roupas

Sistema fullstack simples e minimalista para controle de estoque, vendas e
entradas de mercadoria.

## Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + TypeScript + Express
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT
- **Tempo real:** Socket.IO (o front reconsulta os dados automaticamente
  quando qualquer usuário registra uma venda, entrada ou altera um produto)

## Estrutura

```
estoque-app/
├── backend/     API REST (controllers → services → repositories)
└── frontend/    Interface React
```

O backend segue separação em camadas por módulo (`auth`, `product`, `sale`,
`stock`, `dashboard`), cada um com `dto`, `repository`, `service`,
`controller` e `routes` próprios.

## Como rodar

### 1. Banco de dados

Suba um PostgreSQL local (ou use Docker):

```bash
docker run --name estoque-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=estoque -p 5432:5432 -d postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # ajuste DATABASE_URL e JWT_SECRET se precisar
npm install
npx prisma migrate dev --name init
npm run seed               # cria usuário admin@loja.com / senha 123456
npm run dev                # http://localhost:3333
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env       # ajuste VITE_API_URL se precisar
npm install
npm run dev                # http://localhost:5173
```

Faça login com `admin@loja.com` / `123456` (criado pelo seed) e comece a
cadastrar produtos.

## Regras de negócio implementadas

- SKU gerado automaticamente a partir de categoria + tamanho + cor.
- Não é possível vender mais do que a quantidade em estoque.
- Não é possível cadastrar quantidade negativa.
- Toda venda e entrada de estoque fica registrada em histórico com data.
- Venda e entrada de estoque usam transação no banco (`$transaction`): o
  ajuste de quantidade e o registro do histórico acontecem juntos, ou nenhum
  dos dois acontece, evitando estoque dessincronizado.
- Todas as rotas (exceto login/registro) exigem token JWT válido.

## Telas

1. **Dashboard** — total de produtos, total de vendas, lista simples de
   produtos com estoque baixo (≤ 5 unidades). Sem gráficos.
2. **Produtos** — tabela com busca por nome/SKU, criar/editar/excluir via
   modal simples.
3. **Vendas** — formulário para registrar venda (seleciona produto e
   quantidade) + histórico ordenado por data.
4. **Estoque** — formulário para dar entrada em produtos existentes +
   histórico de entradas.

## Endpoints principais

| Método | Rota                | Descrição                       |
|--------|---------------------|----------------------------------|
| POST   | /auth/login          | Login (retorna JWT)             |
| POST   | /auth/register       | Cria usuário                    |
| GET    | /products            | Lista produtos (?search=)       |
| POST   | /products            | Cria produto                    |
| PUT    | /products/:id        | Edita produto                   |
| DELETE | /products/:id        | Remove produto                  |
| GET    | /sales               | Histórico de vendas              |
| POST   | /sales                | Registra venda (baixa estoque)  |
| GET    | /stock-entries        | Histórico de entradas           |
| POST   | /stock-entries        | Registra entrada (soma estoque) |
| GET    | /dashboard/summary     | Resumo do dashboard              |

Todas as rotas acima (exceto `/auth/*`) exigem header
`Authorization: Bearer <token>`.
