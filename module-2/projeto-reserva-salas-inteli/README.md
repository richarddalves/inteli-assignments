# Sistema de Reserva de Salas - Inteli

[![Instituição](https://img.shields.io/badge/Inteli-Ciência_da_Computação-purple?style=flat-square)](https://www.inteli.edu.br/ciencia-da-computacao/)
[![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=flat-square)](https://github.com/richarddalves/inteli-assignments/tree/main/module-2/projeto-reserva-salas-inteli)

![Hero Illustration](public/images/hero.png)

## Descrição do Sistema

Este é um sistema de reserva de salas desenvolvido para o Instituto de Tecnologia e Liderança (Inteli). O sistema permite que estudantes reservem salas de estudo e cabines para chamadas disponíveis no campus.

**Link para vídeo explicativo:** [https://youtu.be/8-n_9QrAo9k](https://youtu.be/8-n_9QrAo9k)

### Características principais:

- Reservas de 15 minutos a 2 horas
- Status de disponibilidade em tempo real
- Possibilidade de liberar salas antes do término da reserva
- Autenticação com email institucional
- API RESTful completa para gerenciamento de usuários, salas e reservas
- Arquitetura MVC com separação clara de responsabilidades
- Interface responsiva e moderna
- Dashboard com estatísticas em tempo real
- Sistema de notificações para status de reservas
- Suporte a múltiplos tipos de salas e equipamentos

O Inteli possui um modelo de ensino 100% baseado em projetos, e os estudantes são livres para estudar em qualquer espaço do campus. Este sistema facilita o gerenciamento dos espaços compartilhados, garantindo que todos tenham acesso justo às salas de estudo e cabines para chamadas.

| Página Inicial     | Login              |
|--------------------|--------------------|
| ![Print da página inicial](/public/images/pagina-inicial.png) | ![Print da página de login](/public/images/pagina-login.png) |

| Minhas Reservas     | Nova Reserva       |
|---------------------|--------------------|
| ![Print da página de "Minhas Reservas"](/public/images/pagina-minhas-reservas.png) | ![Print da página "Nova Reserva"](/public/images/pagina-nova-reserva.png) |

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL (v12 ou superior)

### Instalação e Configuração

1. **Clone o repositório**:

```bash
git clone https://github.com/richarddalves/inteli-assignments.git
cd inteli-assignments/module-2/projeto-reserva-salas-inteli
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Configure as variáveis de ambiente**:

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do banco de dados
```

Exemplo de configuração do `.env`:

```env
# Configurações do banco de dados
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=
DB_SSL=

# Configurações do servidor
PORT=
NODE_ENV=development  # Qualquer valor diferente de test
```

4. **Inicialize o banco de dados**:

```bash
node src/scripts/runSQLScript.js
```

5. **Execute o servidor**:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Testes

Para executar os testes:

<!--
```bash
npm test
```
-->

Para testar os endpoints da API, utilize o arquivo `rest.http` com a extensão REST Client do VS Code.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Frontend**: EJS, CSS3, JavaScript
- **Arquitetura**: MVC (Model-View-Controller)
- **Documentação**: Markdown, OpenAPI (em desenvolvimento)

## Funcionalidades Principais

### Usuários

- Registro e login com email institucional
- Perfil de usuário com histórico de reservas
- Níveis de acesso (estudante, administrador)

### Reservas

- Agendamento de salas com duração flexível
- Verificação de disponibilidade em tempo real
- Cancelamento e liberação antecipada
- Notificações de status (aprovada, rejeitada, cancelada)

### Salas

- Categorização por tipo (estudo, chamada)
- Status de disponibilidade em tempo real
- Equipamentos e recursos disponíveis
- Localização e capacidade

### Dashboard

- Estatísticas de uso em tempo real
- Gráficos de ocupação
- Relatórios de utilização
- Monitoramento de reservas ativas

## API Endpoints

A API oferece endpoints para gerenciamento completo do sistema. Principais recursos:

- **Usuários**: `/usuarios` - Gerenciamento de estudantes e administradores
- **Salas**: `/salas` - Gerenciamento de salas de estudo e cabines
- **Tipos de Sala**: `/tipos-sala` - Categorização dos espaços
- **Reservas**: `/reservas` - Agendamento e controle de reservas

Para a documentação completa dos endpoints, consulte o arquivo [docs/wad.md](./docs/wad.md#api-rest).

## Documentação

### Documentação Técnica Completa

- **Arquitetura Web (WAD)**: [`docs/wad.md`](./docs/wad.md) - Documentação técnica detalhada
- **Documentação HTML**: [`public/pages/documentacao.html`](./public/pages/documentacao.html) - Versão navegável

### Modelo de Dados

- **Diagrama Interativo**: [`public/images/modelo-banco.svg`](./public/images/modelo-banco.svg)
- **Versão PDF**: [`public/files/modelo-banco.pdf`](./public/files/modelo-banco.pdf)

## Estrutura do Projeto

```
./
├── src/                  # Código fonte
│   ├── server.js        # Servidor principal
│   ├── config/          # Configurações
│   ├── controllers/     # Controladores (MVC)
│   ├── models/          # Modelos de dados
│   ├── repositories/    # Acesso a dados
│   ├── routes/          # Rotas da API
│   ├── services/        # Lógica de negócio
│   ├── views/           # Templates EJS
│   └── scripts/         # Scripts utilitários
├── public/              # Arquivos estáticos
│   ├── css/            # Estilos
│   ├── images/         # Imagens e ícones
│   └── js/             # Scripts do cliente
├── docs/                # Documentação
├── tests/               # Testes automatizados
├── .env.example         # Exemplo de configuração
├── package.json         # Dependências
└── README.md            # Este arquivo
```

## Licença

Este projeto faz parte do módulo 2 do curso de Ciência da Computação do Inteli.

## Autor

Richard Alves - Estudante de Ciência da Computação no Inteli
