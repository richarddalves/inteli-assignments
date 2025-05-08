# Sistema de Reserva de Salas - Inteli

## Descrição do Sistema

Este é um sistema de reserva de salas desenvolvido para o Instituto de Tecnologia e Liderança (Inteli). O sistema permite que estudantes reservem salas de estudo e cabines para chamadas disponíveis no campus.

### Características principais:

- Reservas de 15 minutos a 2 horas
- Status de disponibilidade em tempo real
- Possibilidade de liberar salas antes do término da reserva
- Autenticação com email institucional

O Inteli possui um modelo de ensino 100% baseado em projetos, e os estudantes são livres para estudar em qualquer espaço do campus. Este sistema facilita o gerenciamento dos espaços compartilhados, garantindo que todos tenham acesso justo às salas de estudo e cabines para chamadas.

## Estrutura de Pastas e Arquivos

```
./
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── assets/                # Arquivos estáticos
│   └── modelo-banco.pdf   # Diagrama do banco de dados
├── config/                # Arquivos de configuração
│   └── database.js        # Conexão com o banco de dados
├── controllers/           # Lógica de controle das requisições
│   └── HomeController.js  # Controlador da página inicial
├── docs/                  # Documentação do projeto
│   └── wad.md             # Web Application Document
├── jest.config.js         # Configuração de testes
├── models/                # Definição dos modelos de dados
│   └── User.js            # Modelo de usuário
├── package-lock.json      # Versões exatas das dependências
├── package.json           # Dependências do projeto
├── readme.md              # Documentação do projeto (este arquivo)
├── rest.http              # Testes de API
├── routes/                # Definição das rotas do sistema
│   └── index.js           # Rotas principais
├── scripts/               # Scripts do frontend
├── server.js              # Arquivo principal que inicializa o servidor
├── services/              # Serviços auxiliares
│   └── userService.js     # Serviço para usuários
├── styles/                # CSS do frontend
└── tests/                 # Testes automatizados
```

## Modelo de Dados

O sistema utiliza um banco de dados relacional com as seguintes entidades principais:

- **Users**: Estudantes e administradores do sistema
- **Room Types**: Categorias (sala de estudo, cabine)
- **Rooms**: As 8 salas de estudo e 2 cabines disponíveis
- **Bookings**: Agendamentos feitos pelos usuários
- **Notifications**: Alertas sobre reservas

O diagrama do banco de dados está disponível em <a href="./assets/modelo-banco.pdf">`assets/modelo-banco.pdf`</a>.<br>

<img src="./assets/modelo-banco.svg">

## Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL (para o banco de dados)

### Passos para Execução

1. Clone o repositório:

```bash
git clone https://github.com/richarddalves/inteli-assignments.git
cd inteli-assignments/module-2/week-2/reserva-salas-inteli
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente: **(ainda não necessário).**

```bash
cp .env.example .env
# Edite o arquivo .env com seus dados de conexão ao banco
```

4. Crie o banco de dados: (**ainda não necessário).**

```bash
# Execute o SQL disponível na documentação para criar o schema
psql -U seu_usuario -d nome_do_banco -f schema.sql
```

5. Execute o servidor:

```bash
npm start
```

6. Acesse o sistema no navegador:

```
http://localhost:3000 ou http://127.0.0.1:3000/
```

## Funcionalidades Principais

- Visualização de salas disponíveis
- Reserva de salas com definição de período (15min-2h)
- Cancelamento de reservas
- Liberação antecipada de salas
- Notificações sobre status das reservas

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript

## Testes

Para executar os testes, utilize o comando:

```bash
npm test
```

## Documentação Adicional

A documentação completa da arquitetura web está disponível em <a href="./docs/wad.md">`docs/wad.md`</a>.
