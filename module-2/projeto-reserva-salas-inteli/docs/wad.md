# Documento de Arquitetura Web (WAD)

## Sistema de Reserva de Salas - Inteli

## Índice

1. [Introdução](#introdução)
   - [Objetivos do Sistema](#objetivos-do-sistema)
   - [Escopo](#escopo)
   - [Público-alvo](#público-alvo)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
   - [Estrutura do Projeto](#estrutura-do-projeto)
   - [Padrão MVC](#padrão-mvc)
3. [Banco de Dados](#banco-de-dados)
   - [Configuração PostgreSQL](#configuração-postgresql)
   - [Modelo de Dados](#modelo-de-dados)
   - [Estrutura das Tabelas](#estrutura-das-tabelas)
4. [API REST](#api-rest)
   - [Endpoints](#endpoints)
   - [Modelos de Dados](#modelos-de-dados)
   - [Regras de Negócio](#regras-de-negócio)
5. [Interface do Usuário](#interface-do-usuário)
   - [Design Responsivo](#design-responsivo)
   - [Componentes](#componentes)
   - [Interatividade](#interatividade)
6. [Aspectos Técnicos](#aspectos-técnicos)
   - [Decisões Técnicas](#decisões-técnicas)
   - [Segurança](#segurança)
   - [Performance](#performance)
7. [Implantação e Manutenção](#implantação-e-manutenção)
   - [Deployment](#deployment)
   - [Manutenção](#manutenção)
8. [Próximos Passos](#próximos-passos)

## Introdução

O Sistema de Reserva de Salas do Inteli é uma aplicação web desenvolvida para atender às necessidades específicas da comunidade acadêmica do Instituto de Tecnologia e Liderança. O sistema permite que os estudantes reservem espaços de estudo no campus, que inclui salas de estudo e cabines para chamadas de vídeo.

**Link para vídeo explicativo:** [https://youtu.be/8-n_9QrAo9k](https://youtu.be/8-n_9QrAo9k)

### Objetivos do Sistema

- Facilitar o agendamento de salas de estudo e cabines para os estudantes
- Permitir reservas com duração flexível entre 15 minutos e 2 horas
- Possibilitar a liberação antecipada de salas quando não estiverem mais em uso
- Fornecer feedback em tempo real sobre a disponibilidade dos espaços
- Melhorar a utilização dos recursos de estudo disponíveis no campus
- Fornecer uma API RESTful completa para integração com outros sistemas
- Oferecer uma interface moderna e responsiva
- Implementar um dashboard com estatísticas em tempo real
- Garantir uma experiência de usuário intuitiva e eficiente

### Escopo

O sistema gerencia o processo completo de reserva de salas através de uma API RESTful e interface web, implementando:

- Gerenciamento de usuários (estudantes e administradores)
- Gerenciamento de salas e seus tipos
- Sistema de reservas com verificação de disponibilidade
- Controle de status das reservas (reservada, aprovada, rejeitada, cancelada, concluída, liberada)
- Dashboard com estatísticas em tempo real
- Interface responsiva e moderna
- Sistema de notificações para status de reservas
- Suporte a múltiplos tipos de salas e equipamentos

### Público-alvo

- Estudantes do Inteli que necessitam de espaços para estudo e reuniões
- Administradores do sistema responsáveis pela gestão dos espaços
- Desenvolvedores que precisam integrar com o sistema via API

## Arquitetura do Sistema

### Estrutura do Projeto

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
│   │   ├── pages/     # Páginas principais
│   │   ├── partials/  # Componentes reutilizáveis
│   │   └── errors/    # Páginas de erro
│   └── server.js       # Arquivo principal
├── public/             # Arquivos estáticos
│   ├── css/           # Estilos
│   ├── images/        # Imagens e ícones
│   └── js/            # Scripts do cliente
├── docs/              # Documentação adicional
└── tests/             # Testes automatizados
```

### Padrão MVC

O sistema segue o padrão Model-View-Controller (MVC) com algumas adaptações para uma API RESTful e interface web:

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

4. **Views** (`src/views/`)
   - Templates EJS para renderização do frontend
   - Componentes reutilizáveis
   - Páginas de erro personalizadas
   - Estrutura organizada em páginas e partials

5. **Routes** (`src/routes/`)
   - Definem endpoints da API
   - Mapeiam URLs para controllers
   - Implementam middleware quando necessário
   - Arquivos: `usuarios.js`, `salas.js`, `reservas.js`, `tipos-sala.js`, `index.js`

## Banco de Dados

### Configuração PostgreSQL

O sistema foi desenvolvido utilizando PostgreSQL como banco de dados relacional. A implementação atual utiliza o Supabase como serviço de banco de dados, mas o sistema é flexível e pode ser configurado para usar qualquer instância PostgreSQL, incluindo instalações locais.

Para usar uma instância local do PostgreSQL, configure as variáveis no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### Modelo de Dados

O modelo de dados do sistema pode ser visualizado através dos seguintes arquivos:

- **Modelo Interativo**: [`public/images/modelo-banco.svg`](../public/images/modelo-banco.svg) - Diagrama interativo em formato SVG
- **Modelo em PDF**: [`public/files/modelo-banco.pdf`](../public/files/modelo-banco.pdf) - Versão em PDF

### Estrutura das Tabelas

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

## API REST

### Endpoints

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
- `POST /salas` - Cria nova sala
- `PUT /salas/:room_id` - Atualiza sala
- `DELETE /salas/:room_id` - Remove sala

#### Reservas
- `GET /reservas` - Lista todas as reservas
- `GET /reservas/:booking_id` - Busca reserva por ID
- `POST /reservas` - Cria nova reserva
- `PUT /reservas/:booking_id` - Atualiza reserva
- `DELETE /reservas/:booking_id` - Remove reserva

### Modelos de Dados

Os modelos de dados da API seguem a estrutura das tabelas do banco de dados, com adição de validações e métodos específicos para serialização/deserialização.

### Regras de Negócio

1. **Reservas**
   - Duração mínima: 15 minutos
   - Duração máxima: 2 horas
   - Verificação de conflitos de horário
   - Status possíveis: reservada, aprovada, rejeitada, cancelada, concluída, liberada

2. **Usuários**
   - Autenticação via email institucional
   - Níveis de acesso: estudante, administrador
   - Validação de matrícula única

3. **Salas**
   - Tipos: estudo, chamada
   - Capacidade mínima: 1 pessoa
   - Status de disponibilidade em tempo real

## Interface do Usuário

### Design Responsivo

A interface foi desenvolvida com foco em responsividade e acessibilidade, utilizando:
- CSS3 com Flexbox e Grid
- Media queries para diferentes tamanhos de tela
- Design mobile-first
- Componentes reutilizáveis

### Componentes

1. **Header**
   - Logo do Inteli
   - Menu de navegação
   - Perfil do usuário

2. **Dashboard**
   - Estatísticas em tempo real
   - Gráficos de ocupação
   - Lista de reservas ativas

3. **Formulários**
   - Reserva de salas
   - Cadastro de usuários
   - Gerenciamento de salas

4. **Notificações**
   - Sistema de alertas
   - Status de reservas
   - Mensagens do sistema

### Interatividade

- Atualizações em tempo real via polling
- Validação de formulários no cliente
- Feedback visual de ações
- Animações suaves
- Navegação intuitiva

## Aspectos Técnicos

### Decisões Técnicas

#### Frameworks e Tecnologias
- **Backend**: Node.js com Express para a API RESTful
- **Frontend**: EJS como template engine, com CSS3 e JavaScript vanilla
- **Banco de Dados**: PostgreSQL com Supabase como serviço
- **Arquitetura**: MVC adaptado para API RESTful, com camada adicional de Repositories

#### Justificativas das Escolhas
- Node.js e Express: Escolhidos pela simplicidade e performance para APIs RESTful
- EJS: Selecionado por sua integração natural com Express e facilidade de uso
- PostgreSQL: Escolhido pela robustez e suporte a relacionamentos complexos
- MVC + Repositories: Implementado para separação clara de responsabilidades e manutenibilidade

### Segurança
- Validação de dados
   - Sanitização de inputs
- Criptografia de senhas

### Performance
- Otimização de queries
- Índices no banco de dados
- Minificação de assets
- Lazy loading de imagens
- Caching de dados estáticos

## Implantação e Manutenção

### Deployment

O sistema pode ser implantado em qualquer ambiente que suporte Node.js e PostgreSQL:

1. **Requisitos**
   - Node.js v14+
   - PostgreSQL v12+
   - Variáveis de ambiente configuradas

2. **Processo**
   - Clone do repositório
   - Instalação de dependências
   - Configuração do banco
   - Build do frontend
   - Inicialização do servidor

### Manutenção

1. **Rotina**
- Backup do banco de dados
   - Monitoramento de logs
   - Atualização de dependências
   - Verificação de segurança

2. **Procedimentos**
   - Deploy de novas versões
   - Rollback em caso de falha
   - Manutenção do banco de dados
   - Limpeza de logs

## Próximos Passos

### O que Funcionou Bem
- Arquitetura MVC com Repositories
- Sistema de autenticação
- API RESTful bem estruturada
- Interface responsiva
- Sistema de notificações
- Testes automatizados

### O que Pode Ser Melhorado
- Implementação de WebSockets para atualizações em tempo real
- Migração para um framework frontend moderno (React/Vue)
- Adição de mais testes de integração
- Implementação de cache para melhor performance
- Melhorias na documentação da API com OpenAPI
- Implementação de CI/CD

### Aprendizados e Desafios

#### Principais Aprendizados
- Implementação de autenticação segura com JWT
- Desenvolvimento de uma API RESTful completa
- Gerenciamento de estados assíncronos no frontend
- Integração com banco de dados PostgreSQL
- Implementação de testes automatizados com Jest

#### Desafios Superados
- Sincronização em tempo real do status das salas
- Validação de conflitos de horários nas reservas
- Implementação de sistema de notificações
- Otimização de queries do banco de dados
- Desenvolvimento de interface responsiva e acessível
