# Controle de Agendamento API

## Descrição
Este é o README.md do projeto Controle de Agendamento API.

## Rotas e Subrotas
### /spreadsheet
1. GET '/'
2. GET '/metadata'
3. GET '/getRows'
4. POST '/addRow'
5. POST '/updateRows'

### /user
1. GET '/'
2. POST '/create'
3. POST '/login'
4. PUT '/update/:id'

## Instalação
1. Clone o repositório
2. Execute o comando `npm install` para instalar as dependências
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute o comando `npm start` para iniciar a API

## Variáveis de Ambiente
- SPREADSHEET_ID
- SECRET (Combinação de Segurança para geração do Token)
- PORT
- DBDATABASE
- DBUSERNAME
- DBPASSWORD
- DBHOSTNAME
- DBDIALECT
- DBPORT