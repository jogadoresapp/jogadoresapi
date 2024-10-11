# Sistema de Gerenciamento de Partidas de Futebol

## Core do Negócio

O sistema foi projetado para gerenciar partidas de futebol, permitindo que jogadores criem, participem e gerenciem partidas. O foco principal é facilitar a organização de jogos entre amigos ou jogadores casuais, controlando a criação de partidas, solicitações de participação e confirmações.

## Entidades Principais

1. **Jogador (Player)**
   - Representa um usuário do sistema
   - Atributos: id, nome, email, senha

2. **Partida (Match)**
   - Representa uma partida de futebol
   - Atributos: id, data, local, nível do time, vagas disponíveis, status

3. **Partida_Jogadores (MatchPlayers)**
   - Representa a relação entre partidas e jogadores
   - Atributos: id_partida, conjunto de id_jogadores, status de cada jogador

## Casos de Uso

1. **RegisterPlayerUseCase**
   - Registra um novo jogador no sistema

2. **LoginPlayerUseCase**
   - Autentica um jogador no sistema

3. **CreateMatchUseCase**
   - Cria uma nova partida

4. **EditMatchUseCase**
   - Edita os detalhes de uma partida existente

5. **CancelMatchUseCase**
   - Cancela uma partida

6. **ListMatchesUseCase**
   - Lista as partidas disponíveis

7. **ConfirmMatchUseCase**
   - Confirma a participação de um jogador em uma partida

8. **GetPlayerMatchesUseCase**
   - Lista todas as partidas em que um jogador está vinculado

9. **RequestToPlayMatchUseCase**
   - Solicita participação em uma partida

10. **RejectPlayRequestUseCase**
    - Recusa a solicitação de um jogador para participar de uma partida

11. **ListPendingRequestsUseCase**
    - Lista as solicitações pendentes para uma partida

12. **GetMatchPlayersUseCase**
    - Obtém todos os jogadores confirmados em uma partida

## Requisitos Funcionais

1. Jogadores podem se registrar e fazer login no sistema
2. Jogadores podem criar novas partidas
3. Jogadores podem editar e cancelar partidas que criaram
4. Jogadores podem visualizar uma lista de partidas disponíveis
5. Jogadores podem solicitar participação em partidas
6. Criadores de partidas podem confirmar ou recusar solicitações de participação
7. Jogadores podem visualizar as partidas em que estão participando
8. O sistema deve controlar o número de vagas disponíveis em cada partida
9. O sistema deve atualizar o status da partida automaticamente quando todas as vagas forem preenchidas

## Requisitos Não Funcionais

1. O sistema deve ser desenvolvido utilizando NestJS e TypeScript
2. Deve seguir os princípios de Clean Architecture e Domain-Driven Design
3. Deve utilizar PostgreSQL como banco de dados
4. Deve implementar autenticação JWT para proteger as rotas
5. Deve ter uma cobertura de testes adequada
6. Deve ter documentação da API usando Swagger

## Tecnologias Utilizadas

- **Backend**: NestJS, TypeScript
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JSON Web Tokens (JWT)
- **Documentação da API**: Swagger (via @nestjs/swagger)
- **Testes**: Jest
- **Qualidade de código**: Sonarqube 

## Fluxo Principal

1. Um jogador se registra no sistema
2. O jogador faz login e recebe um token JWT
3. O jogador cria uma nova partida
4. Outros jogadores visualizam a lista de partidas disponíveis
5. Um jogador solicita participação em uma partida
6. O criador da partida vê as solicitações pendentes
7. O criador confirma ou recusa a solicitação
8. Quando todas as vagas são preenchidas, o status da partida é atualizado para 'EM_EXECUCAO'

## Considerações de Segurança

- Todas as senhas são hasheadas antes de serem armazenadas no banco de dados
- As rotas sensíveis são protegidas por autenticação JWT
- Validações apropriadas são realizadas em todas as entradas do usuário

## Escalabilidade e Desempenho

- Índices apropriados são criados no banco de dados para otimizar consultas frequentes
- A arquitetura em camadas permite fácil manutenção e extensão do sistema
- O uso de TypeORM permite fácil migração para outros bancos de dados, se necessário

## Próximos Passos

4. Desenvolver uma interface de usuário (frontend) para consumir esta API
5. Configurar um pipeline de CI/CD para automatizar testes e deploy
