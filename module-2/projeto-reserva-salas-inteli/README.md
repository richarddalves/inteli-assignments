# Sistema de Reserva de Salas - Inteli

## Descrição do Sistema

Este é um sistema de reserva de salas desenvolvido para o Instituto de Tecnologia e Liderança (Inteli). O sistema permite que estudantes reservem salas de estudo e cabines para chamadas disponíveis no campus.

### Características principais:

- Reservas de 15 minutos a 2 horas
- Status de disponibilidade em tempo real
- Possibilidade de liberar salas antes do término da reserva
- Autenticação com email institucional
- API RESTful completa para gerenciamento de usuários, salas e reservas
- Arquitetura MVC com separação clara de responsabilidades

O Inteli possui um modelo de ensino 100% baseado em projetos, e os estudantes são livres para estudar em qualquer espaço do campus. Este sistema facilita o gerenciamento dos espaços compartilhados, garantindo que todos tenham acesso justo às salas de estudo e cabines para chamadas.

## Estrutura de Pastas e Arquivos

```
./
├── .env.example           # Exemplo de variáveis de ambiente
├── docs/                  # Documentação do projeto
│   └── wad.md            # Web Application Document
├── README.md              # Documentação do projeto (este arquivo)
├── public/               # Arquivos estáticos
│   ├── images/          # Imagens do projeto
│   │   └── modelo-banco.svg
│   ├── files/           # Arquivos do projeto
│   │   └── modelo-banco.pdf
│   ├── js/              # Scripts JavaScript
│   ├── fonts/           # Fontes
│   ├── styles/          # Estilos CSS
│   │   ├── documentacao.css
│   │   ├── errors.css
│   │   └── main.css
│   └── pages/           # Páginas HTML
│       └── documentacao.html
├── .gitignore            # Arquivos ignorados pelo Git
├── rest.http             # Testes de API
├── package-lock.json     # Versões exatas das dependências
├── jest.config.js        # Configuração de testes
├── package.json          # Dependências do projeto
└── src/                  # Código fonte da aplicação
    ├── server.js         # Arquivo principal do servidor
    ├── repositories/     # Camada de acesso a dados
    │   ├── UsuarioRepository.js
    │   ├── SalaRepository.js
    │   ├── TipoSalaRepository.js
    │   └── ReservaRepository.js
    ├── scripts/         # Scripts utilitários
    │   ├── sql/        # Scripts SQL
    │   │   └── init.sql
    │   └── runSQLScript.js
    ├── models/         # Modelos (MVC)
    │   ├── Reserva.js
    │   ├── TipoSala.js
    │   ├── Usuario.js
    │   └── Sala.js
    ├── services/      # Serviços da aplicação
    │   ├── UsuarioService.js
    │   ├── ReservaService.js
    │   └── SalaService.js
    ├── config/       # Configurações
    │   └── db.js    # Configuração do banco de dados
    ├── routes/      # Rotas da API
    │   ├── reservas.js
    │   ├── salas.js
    │   ├── tipos-sala.js
    │   ├── usuarios.js
    │   └── index.js
    ├── controllers/ # Controladores (MVC)
    │   ├── UsuarioController.js
    │   ├── TipoSalaController.js
    │   ├── ReservaController.js
    │   └── SalaController.js
    └── views/      # Views da aplicação
        ├── errors/
        │   ├── 404.ejs
        │   └── 500.ejs
        ├── pages/
        │   └── index.ejs
        └── partials/
            ├── footer.ejs
            └── header.ejs
```

## Modelo de Dados

O sistema utiliza um banco de dados PostgreSQL com as seguintes entidades principais:

- **Users**: Estudantes e administradores do sistema
  - Campos: user_id, name, email, password, role, registration_number, is_active, created_at, updated_at
- **Rooms**: As salas de estudo e cabines disponíveis
  - Campos: room_id, name, capacity, room_type_id, location, description, is_active, created_at, updated_at
- **Room Types**: Tipos de sala disponíveis
  - Campos: room_type_id, type_name, description, is_active, created_at, updated_at
- **Bookings**: Agendamentos feitos pelos usuários
  - Campos: booking_id, room_id, user_id, start_time, end_time, status, reason, created_at, updated_at

## API Endpoints

### Usuários

- `GET /usuarios` - Lista todos os usuários
- `GET /usuarios/:user_id` - Busca usuário por ID
- `POST /usuarios` - Cria novo usuário
- `PUT /usuarios/:user_id` - Atualiza usuário
- `DELETE /usuarios/:user_id` - Remove usuário

### Tipos de Sala

- `GET /tipos-sala` - Lista todos os tipos de sala
- `GET /tipos-sala/:room_type_id` - Busca tipo de sala por ID
- `POST /tipos-sala` - Cria novo tipo de sala
- `PUT /tipos-sala/:room_type_id` - Atualiza tipo de sala
- `DELETE /tipos-sala/:room_type_id` - Remove tipo de sala

### Salas

- `GET /salas` - Lista todas as salas
- `GET /salas/:room_id` - Busca sala por ID
- `GET /salas/tipo/:room_type_id` - Busca salas por tipo
- `POST /salas` - Cria nova sala
- `PUT /salas/:room_id` - Atualiza sala
- `DELETE /salas/:room_id` - Remove sala

### Reservas

- `GET /reservas` - Lista todas as reservas
- `GET /reservas/:booking_id` - Busca reserva por ID
- `GET /reservas/usuario/:user_id` - Busca reservas por usuário
- `GET /reservas/sala/:room_id` - Busca reservas por sala
- `POST /reservas` - Cria nova reserva
- `PUT /reservas/:booking_id` - Atualiza reserva
- `PATCH /reservas/:booking_id/status` - Atualiza status da reserva
- `DELETE /reservas/:booking_id` - Remove reserva

## Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL (v12 ou superior)

### Passos para Execução

1. Clone o repositório:

```bash
git clone https://github.com/richarddalves/inteli-assignments.git
cd inteli-assignments/module-2/projeto-reserva-salas-inteli
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do banco de dados
```

4. Execute o servidor:

```bash
npm start
```

5. Teste a API:

```bash
# Use o arquivo rest.http para testar os endpoints
```

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Arquitetura**: MVC (Model-View-Controller)
- **Documentação**: Markdown, OpenAPI (em desenvolvimento)

## Testes

Para executar os testes:

```bash
npm test
```

## Documentação Adicional

A documentação completa da arquitetura web está disponível em [docs/wad.md](./docs/wad.md) e a documentação em HTML está disponível em [public/pages/documentacao.html](./public/pages/documentacao.html).

## Configuração do Banco de Dados

O projeto utiliza PostgreSQL como banco de dados. Você pode configurar um banco de dados local ou usar um serviço de hospedagem de sua preferência. Para configurar:

1. Crie um banco de dados PostgreSQL
2. Configure o arquivo `.env` com as credenciais:

```env
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=
DB_SSL=
```

3. Execute o script de inicialização do banco de dados:

```bash
node src/scripts/runSQLScript.js
```
