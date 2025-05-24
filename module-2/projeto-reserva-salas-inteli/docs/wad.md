# Documento de Arquitetura Web (WAD)

## Sistema de Reserva de Salas - Inteli

## Introdução

O Sistema de Reserva de Salas do Inteli é uma aplicação web desenvolvida para atender às necessidades específicas da comunidade acadêmica do Instituto de Tecnologia e Liderança. O sistema permite que os estudantes reservem espaços de estudo no campus, que inclui salas de estudo e cabines para chamadas de vídeo.

### Objetivos do Sistema

- Facilitar o agendamento de salas de estudo e cabines para os estudantes
- Permitir reservas com duração flexível entre 15 minutos e 2 horas
- Possibilitar a liberação antecipada de salas quando não estiverem mais em uso
- Fornecer feedback em tempo real sobre a disponibilidade dos espaços
- Melhorar a utilização dos recursos de estudo disponíveis no campus
- Fornecer uma API RESTful completa para integração com outros sistemas

### Escopo

O sistema gerencia o processo completo de reserva de salas através de uma API RESTful, implementando:

- Gerenciamento de usuários (estudantes e administradores)
- Gerenciamento de salas e seus tipos
- Sistema de reservas com verificação de disponibilidade
- Controle de status das reservas (reserved, approved, rejected, cancelled, completed, released)

### Público-alvo

- Estudantes do Inteli que necessitam de espaços para estudo e reuniões
- Administradores do sistema responsáveis pela gestão dos espaços
- Desenvolvedores que precisam integrar com o sistema via API

## Arquitetura do Sistema

### Padrão MVC

O sistema segue o padrão Model-View-Controller (MVC) com algumas adaptações para uma API RESTful:

1. **Models** (`src/models/`)

   - Definem a estrutura dos dados
   - Implementam validações básicas
   - Fornecem métodos para serialização/deserialização
   - Classes: `Usuario`, `Sala`, `Reserva`, `TipoSala`

2. **Controllers** (`src/controllers/`)

   - Implementam a lógica de negócio
   - Processam requisições HTTP
   - Validam dados de entrada
   - Gerenciam respostas e erros
   - Classes: `UsuarioController`, `SalaController`, `ReservaController`, `TipoSalaController`

3. **Repositories** (`src/repositories/`)

   - Camada adicional para abstração do banco de dados
   - Implementam operações CRUD
   - Gerenciam queries SQL
   - Classes: `UsuarioRepository`, `SalaRepository`, `ReservaRepository`, `TipoSalaRepository`

4. **Routes** (`src/routes/`)
   - Definem endpoints da API
   - Mapeiam URLs para controllers
   - Implementam middleware quando necessário
   - Arquivos: `usuarios.js`, `salas.js`, `reservas.js`, `tipos-sala.js`, `index.js`

### Banco de Dados

O sistema utiliza PostgreSQL como banco de dados relacional, com as seguintes tabelas principais:

1. **users**

   ```sql
   CREATE TABLE users (
     user_id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL,
     registration_number VARCHAR(20) UNIQUE NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **room_types**

   ```sql
   CREATE TABLE room_types (
     room_type_id SERIAL PRIMARY KEY,
     type_name VARCHAR(50) NOT NULL UNIQUE,
     description TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **rooms**

   ```sql
   CREATE TABLE rooms (
     room_id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE,
     capacity INTEGER NOT NULL,
     room_type_id INTEGER REFERENCES room_types(room_type_id),
     location VARCHAR(100),
     description TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **bookings**

   ```sql
   CREATE TABLE bookings (
     booking_id SERIAL PRIMARY KEY,
     room_id INTEGER REFERENCES rooms(room_id),
     user_id INTEGER REFERENCES users(user_id),
     start_time TIMESTAMP NOT NULL,
     end_time TIMESTAMP NOT NULL,
     status VARCHAR(20) NOT NULL,
     reason TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### API Endpoints

#### Usuários

- `GET /usuarios` - Lista todos os usuários
- `GET /usuarios/:user_id` - Busca usuário por ID
- `POST /usuarios` - Cria novo usuário
- `PUT /usuarios/:user_id` - Atualiza usuário
- `DELETE /usuarios/:user_id` - Remove usuário

#### Tipos de Sala

- `GET /tipos-sala` - Lista todos os tipos de sala
- `GET /tipos-sala/:room_type_id` - Busca tipo de sala por ID
- `POST /tipos-sala` - Cria novo tipo de sala
- `PUT /tipos-sala/:room_type_id` - Atualiza tipo de sala
- `DELETE /tipos-sala/:room_type_id` - Remove tipo de sala

#### Salas

- `GET /salas` - Lista todas as salas
- `GET /salas/:room_id` - Busca sala por ID
- `GET /salas/tipo/:room_type_id` - Busca salas por tipo
- `POST /salas` - Cria nova sala
- `PUT /salas/:room_id` - Atualiza sala
- `DELETE /salas/:room_id` - Remove sala

#### Reservas

- `GET /reservas` - Lista todas as reservas
- `GET /reservas/:booking_id` - Busca reserva por ID
- `GET /reservas/usuario/:user_id` - Busca reservas por usuário
- `GET /reservas/sala/:room_id` - Busca reservas por sala
- `POST /reservas` - Cria nova reserva
- `PUT /reservas/:booking_id` - Atualiza reserva
- `PATCH /reservas/:booking_id/status` - Atualiza status da reserva
- `DELETE /reservas/:booking_id` - Remove reserva

### Regras de Negócio

1. **Reservas**

   - Duração mínima: 15 minutos
   - Duração máxima: 2 horas
   - Não permitir sobreposição de reservas para a mesma sala
   - Status possíveis: reserved, approved, rejected, cancelled, completed, released

2. **Usuários**

   - Email deve ser institucional (@inteli.edu.br ou @sou.inteli.edu.br)
   - Senha deve ser hasheada antes de armazenar
   - Tipos: student, admin

3. **Salas**
   - Tipos: sala de estudo, cabine
   - Capacidade deve ser maior que zero
   - Nome deve ser único

### Segurança

1. **Autenticação**

   - Implementação futura de JWT
   - Validação de email institucional
   - Senhas hasheadas com bcrypt

2. **Autorização**

   - Controle de acesso baseado em tipo de usuário
   - Validação de propriedade de recursos

3. **Validação de Dados**
   - Sanitização de inputs
   - Validação de tipos e formatos
   - Tratamento de erros consistente

### Testes

1. **Testes Unitários**

   - Models
   - Controllers
   - Repositories

2. **Testes de Integração**

   - Endpoints da API
   - Operações de banco de dados
   - Fluxos completos de reserva

3. **Testes de Carga**
   - Verificação de disponibilidade
   - Criação de reservas
   - Listagem de recursos

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **ORM**: pg (node-postgres)
- **Testes**: Jest
- **Documentação**: Markdown, OpenAPI (em desenvolvimento)

## Próximos Passos

1. Implementar autenticação JWT
2. Adicionar documentação OpenAPI/Swagger
3. Implementar sistema de notificações
4. Desenvolver interface web
5. Adicionar testes automatizados
6. Implementar cache para melhor performance
7. Adicionar logs e monitoramento

## Configuração do Banco de Dados

### Banco de Dados PostgreSQL

O sistema foi desenvolvido utilizando PostgreSQL como banco de dados relacional. A implementação atual utiliza o Supabase como serviço de banco de dados, mas o sistema é flexível e pode ser configurado para usar qualquer instância PostgreSQL, incluindo instalações locais.

#### Configuração via Supabase

Para usar o Supabase, configure as seguintes variáveis no arquivo `.env`:

```env
DB_HOST=seu-projeto.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua-senha
```

#### Configuração Local

Para usar uma instância local do PostgreSQL, configure as variáveis no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

O sistema utiliza a biblioteca `pg` (node-postgres) para conexão com o banco de dados, que é compatível com qualquer instância PostgreSQL padrão. A única diferença entre usar Supabase ou uma instância local está na configuração das variáveis de ambiente.

### Estrutura do Banco de Dados

1. **users**

   ```sql
   CREATE TABLE users (
     user_id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL,
     registration_number VARCHAR(20) UNIQUE NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **room_types**

   ```sql
   CREATE TABLE room_types (
     room_type_id SERIAL PRIMARY KEY,
     type_name VARCHAR(50) NOT NULL UNIQUE,
     description TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **rooms**

   ```sql
   CREATE TABLE rooms (
     room_id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE,
     capacity INTEGER NOT NULL,
     room_type_id INTEGER REFERENCES room_types(room_type_id),
     location VARCHAR(100),
     description TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **bookings**

   ```sql
   CREATE TABLE bookings (
     booking_id SERIAL PRIMARY KEY,
     room_id INTEGER REFERENCES rooms(room_id),
     user_id INTEGER REFERENCES users(user_id),
     start_time TIMESTAMP NOT NULL,
     end_time TIMESTAMP NOT NULL,
     status VARCHAR(20) NOT NULL,
     reason TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Estrutura do Projeto

```
reserva-salas/
├── src/
│   ├── config/         # Configurações do projeto
│   │   └── db.js       # Configuração do banco de dados
│   ├── controllers/    # Controladores da aplicação
│   ├── models/         # Modelos de dados
│   ├── repositories/   # Repositórios para acesso ao banco
│   ├── routes/         # Rotas da API
│   ├── views/          # Templates EJS
│   └── server.js       # Arquivo principal
├── public/             # Arquivos estáticos
├── docs/              # Documentação adicional
└── tests/             # Testes automatizados
```

## Rotas da API

### Usuários

- `GET /usuarios` - Lista todos os usuários
- `GET /usuarios/:id` - Busca um usuário específico
- `POST /usuarios` - Cria um novo usuário
- `PUT /usuarios/:id` - Atualiza um usuário
- `DELETE /usuarios/:id` - Remove um usuário

### Salas

- `GET /salas` - Lista todas as salas
- `GET /salas/:id` - Busca uma sala específica
- `POST /salas` - Cria uma nova sala
- `PUT /salas/:id` - Atualiza uma sala
- `DELETE /salas/:id` - Remove uma sala

### Reservas

- `GET /reservas` - Lista todas as reservas
- `GET /reservas/:id` - Busca uma reserva específica
- `POST /reservas` - Cria uma nova reserva
- `PUT /reservas/:id` - Atualiza uma reserva
- `DELETE /reservas/:id` - Remove uma reserva

## Modelos de Dados

### Usuário

```javascript
{
  id: number,
  name: string,
  email: string,
  password: string,
  registration_number: string,
  role: string,
  is_active: boolean,
  created_at: Date,
  updated_at: Date
}
```

### Sala

```javascript
{
  id: number,
  name: string,
  room_type_id: number,
  floor: number,
  building: string,
  is_active: boolean,
  created_at: Date,
  updated_at: Date
}
```

### Reserva

```javascript
{
  id: number,
  user_id: number,
  room_id: number,
  start_time: Date,
  end_time: Date,
  purpose: string,
  status: string,
  created_at: Date,
  updated_at: Date
}
```

## Segurança

- Conexão SSL com o banco de dados
- Senhas criptografadas com bcrypt
- Validação de dados de entrada
- Proteção contra SQL Injection
- Headers de segurança configurados

## Performance

- Pool de conexões com o banco de dados
- Cache de consultas frequentes
- Compressão de respostas
- Logging de queries para otimização

## Monitoramento

- Logs de requisições
- Logs de erros
- Logs de queries
- Métricas de performance

## Testes

- Testes unitários com Jest
- Testes de integração
- Testes de API com REST Client

## Deployment

1. Configurar variáveis de ambiente
2. Instalar dependências
3. Executar migrações do banco
4. Iniciar o servidor

## Manutenção

- Logs de erros
- Monitoramento de performance
- Backup do banco de dados
- Atualizações de segurança
