# Joao Pedro dos Santos — Portfólio & Painel

Portfólio de Joao Pedro dos Santos, programador freelancer, com site público editorial, projetos individuais, formulário de contato e painel administrativo privado.

## O que está incluído

- Home cinematográfica com intro curta, navegação adaptativa, animações, projetos editoriais, skills, trajetória e contato.
- Rotas públicas `/`, `/about`, `/projects`, `/projects/[slug]` e `/contact`.
- Painel em `/admin` com dashboard, CRUD de projetos, publicação, destaques, upload de imagens, mensagens e configurações.
- Dados persistentes em D1 e imagens persistentes em R2.
- Autenticação administrativa própria com usuário, senha protegida por PBKDF2 e sessão assinada em cookie seguro.
- Validação Zod, sanitização, limite de envio no contato e confirmação antes de excluir.
- SEO com metadata, canonical, Open Graph, X Card, sitemap, robots e metadata dinâmica dos cases.
- Acessibilidade, navegação por teclado e suporte a `prefers-reduced-motion`.

## Requisitos

- Node.js 22.13 ou superior.
- npm 10 ou pnpm 11.

## Instalação local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Na primeira requisição, o site prepara automaticamente o banco local e cadastra o conteúdo inicial do portfólio.

## Variáveis de ambiente

Copie `.env.example` e configure:

- `ADMIN_USERNAME`: usuário do painel.
- `ADMIN_PASSWORD_HASH`: senha convertida em hash PBKDF2-SHA256; nunca coloque a senha aberta no arquivo.
- `ADMIN_SESSION_SECRET`: chave aleatória com pelo menos 32 caracteres usada para assinar a sessão.
- `RESEND_API_KEY`: chave do Resend para notificação de novos contatos (opcional).
- `CONTACT_TO_EMAIL`: endereço que recebe as notificações (opcional).

Nunca versionar valores reais. Em produção, configure-os como secrets do ambiente de hospedagem.

## Banco de dados

O schema está em `db/schema.ts` e cobre projetos, imagens, mensagens, trajetória e configurações.

Após alterar o schema:

```bash
npm run db:generate
```

Revise o SQL gerado em `drizzle/`. As migrações são aplicadas ao D1 durante a publicação do Site.

## Primeiro administrador

1. Gere o hash PBKDF2 da senha escolhida.
2. Preencha `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET` no ambiente.
3. Acesse `/admin/login` e entre com o usuário e a senha correspondentes.
4. O servidor valida o hash e entrega uma sessão assinada, `HttpOnly` e `SameSite=Strict` antes de liberar páginas e APIs administrativas.

A senha aberta não é armazenada nem versionada.

## Upload de imagens

O painel aceita JPG, PNG e WebP de até 6 MB. Os arquivos são enviados ao binding R2 `MEDIA`; o banco guarda apenas a URL. O filesystem da aplicação não é usado como armazenamento persistente.

## Formulário e e-mail

Toda mensagem é persistida e aparece em `/admin/messages`. Se `RESEND_API_KEY` e `CONTACT_TO_EMAIL` estiverem configurados, uma notificação também é enviada pelo Resend. A persistência não depende do e-mail, então uma falha externa não perde a mensagem.

## Scripts

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run lint         # análise estática
npm run db:generate  # gerar migrações
```

## Publicação

O projeto usa Vinext e gera um Worker ESM compatível com Sites. A publicação provisiona os recursos D1 e R2 definidos em `.openai/hosting.json`, aplica as migrações e injeta os secrets configurados sem expô-los no repositório.

Antes de publicar, sempre execute:

```bash
npm run build
```

## Personalização

- Troque nome, bio, e-mail e redes em `/admin/settings`.
- Substitua o espaço editorial de retrato quando tiver uma fotografia final.
- Adicione ou edite projetos pelo painel conforme novos trabalhos forem publicados.
- Atualize a capa social em `public/og.png` quando a identidade principal mudar.
