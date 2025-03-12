# Fluxera - Gestão de Projetos Moderna

Fluxera é uma plataforma SaaS (Software as a Service) moderna para gestão de projetos, desenvolvida com as mais recentes tecnologias web.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14, React, TypeScript
- **UI/UX**: Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: Supabase, Prisma ORM
- **Autenticação**: Supabase Auth
- **Gráficos**: Recharts
- **Editor**: BlockNote

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas Next.js
│   ├── (auth)/            # Fluxo de autenticação
│   ├── (workspaces)/      # Área logada
│   └── (out)/             # Rotas públicas
├── features/              # Módulos principais
│   ├── auth/              # Autenticação
│   ├── projects/          # Gestão de projetos
│   ├── workspaces/        # Espaços de trabalho
│   ├── members/           # Gestão de membros
│   └── roles/             # Controle de acesso
├── components/            # Componentes reutilizáveis
└── lib/                   # Utilitários e configurações
```

## 🛠 Configuração do Ambiente

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/fluxera.git
cd fluxera
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

4. Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🔑 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
DATABASE_URL=sua-url-banco-dados
```

## 📦 Features Principais

- ✨ Interface moderna e responsiva
- 🌓 Modo claro/escuro
- 👥 Gestão de equipes e membros
- 📊 Dashboard com análises
- 📝 Editor de rich text
- 🔐 Sistema de permissões
- 🏢 Múltiplos workspaces

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
