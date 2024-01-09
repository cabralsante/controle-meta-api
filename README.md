# Para criar uma aplicação com credenciais para Google Sheet:

1. Entrar no site do Console Cloud da Google e logar com a conta:
 - https://console.cloud.google.com/
   
2. Criar um novo projeto;
   
3. Ir em Biblioteca e procurar por Google Sheets API e instalar;
   
  4. Seguir para a aba Credenciais;
   
    4.1. Clicar em CRIAR CREDENCIAIS;
  
    4.2. Acessar CRIAR CONTA DE SERVIÇO;
  
    4.2.1. Preencher detalhes da conta de serviço;
    
      4.2.1.1. Copiar email gerado;
      
    4.2.2. Na seção "Conceda a essa conta de serviço acesso ao projeto (Opcional)" selecione o dropdown titulado como "Papel";
    
      4.2.2.1 Selecionar a opção "Em uso" e ao lado, "Propietário"
      
    4.2.3. A terceira etapa do preenchimento é opcional;
    
5. Após isso, ainda na aba de Credenciais, clicar na conta criada;

6. Seguir para a aba "Chaves";
   
       6.1. Clicar em Adicionar Chave e em seguida Criar nova chave;
        
       6.2. Mantenha JSON marcado e clique em cirar;
   
7. Guarde o arquivo JSON na pasta raiz do projeto;


# Controle de Agendamento API

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
- AGEND_ID
- COMP_ID
- ASB_ID
- SECRET (Combinação de Segurança para geração do Token)
- PORT
- DBDATABASE
- DBUSERNAME
- DBPASSWORD
- DBHOSTNAME
- DBDIALECT
- DBPORT
