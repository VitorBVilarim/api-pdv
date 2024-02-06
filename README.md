
## PDV ( Ponto de Venda )

- API REST que serve como uma interface para a frente de caixa de um negócio. Ela possui várias funcionalidades essenciais para a operação de um negócio, incluindo                 
 
 ## Link de Deploy da API para testes
 - http://ec2-15-229-4-157.sa-east-1.compute.amazonaws.com:3000/
 
 ## Funcionalidades 

- Clientes: Permite a criação, leitura, atualização e exclusão de informações dos clientes. 

- Produtos: Permite gerenciar o inventário de produtos. Os usuários podem adicionar novos produtos, atualizar informações de produtos existentes, ler informações de produtos e excluir produtos do sistema.

- Pedidos: Permite gerenciar pedidos dos clientes. Os usuários podem criar novos pedidos, atualizar o status dos pedidos, visualizar detalhes dos pedidos e excluir pedidos.

- Cadastro e Login de Usuário: A API também possui funcionalidades para o cadastro de novos usuários e login de usuários existentes. Isso permite que os usuários acessem o sistema e realizem suas tarefas.

## Bibliotecas ultilizadas; 

- express 
Utilizada para iniciar o servidor de forma mais simples e robusta & gerir as requisições HTTP 
|---------------------------------------------------------------------------------| 
=======
>>>>>>> 92af266f4e91118180d6218f286e6ac1d93d28df

- Produtos: Permite gerenciar o inventário de produtos. Os usuários podem adicionar novos produtos, atualizar informações de produtos existentes, ler informações de produtos e excluir produtos do sistema.

<<<<<<< HEAD
- dotenv
Ultilizada para gerenciar as variaveis de ambiente dentro do projeto
|---------------------------------------------------------------------------------| 

- cors
 Usada para habilitar o Compartilhamento de Recursos entre Origens (CORS) 
|---------------------------------------------------------------------------------| 

- joi
Usada para a validação de dados baseada em esquemas, facilitando a verificação dos dados no Body, Query...
|---------------------------------------------------------------------------------| 

- aws-sdk
Usada para facilitar a conexão com o servidor de armazenamento de imagens
|---------------------------------------------------------------------------------| 

- multer
é Usada para criação de um middleware que lida com dados multipart/form-data, que são usados no upload das imagens dos produtos. 
|---------------------------------------------------------------------------------| 

- pg
Ultilizada para fazer a conexão da API com o Banco de dados
|---------------------------------------------------------------------------------| 

- knex
Ultilizada para facilitar a montagem da query sql de uma forma mais facil e limpa
|---------------------------------------------------------------------------------| 

- nodemailer
Ultilizada para conectar a API com o servidor SMTP para envio de email'sdk
|---------------------------------------------------------------------------------| 

- bcrypt
Ultilizada para criptografar a senha do usuario, trazendo mais segurança a API

- jsonwebtoken
Usado para autenticação &autorização do usuario, deixando a API mais segura.

=======
- Pedidos: Permite gerenciar pedidos dos clientes. Os usuários podem criar novos pedidos, atualizar o status dos pedidos, visualizar detalhes dos pedidos e excluir pedidos.

- Cadastro e Login de Usuário: A API também possui funcionalidades para o cadastro de novos usuários e login de usuários existentes. Isso permite que os usuários acessem o sistema e realizem suas tarefas.

## Bibliotecas ultilizadas; 

- Express: 
- Utilizada para iniciar o servidor de forma mais simples e robusta & gerir as requisições HTTP 

- Dotenv:
Ultilizada para gerenciar as variaveis de ambiente dentro do projeto

- Cors:
 Usada para habilitar o Compartilhamento de Recursos entre Origens (CORS) 

- Joi:
Usada para a validação de dados baseada em esquemas, facilitando a verificação dos dados no Body, Query...

- Aws-sdk: 
Usada para facilitar a conexão com o servidor de armazenamento de imagens

- Multer:
é Usada para criação de um middleware que lida com dados multipart/form-data, que são usados no upload das imagens dos produtos. 

- Pg:
Ultilizada para fazer a conexão da API com o Banco de dados

- Knex:
Ultilizada para facilitar a montagem da query sql de uma forma mais facil e limpa

- Nodemailer:
Ultilizada para conectar a API com o servidor SMTP para envio de email'sdk

- Bcrypt:
Ultilizada para criptografar a senha do usuario, trazendo mais segurança a API

- Jsonwebtoken:
  Usado para autenticação &autorização do usuario, deixando a API mais segura

>>>>>>> 92af266f4e91118180d6218f286e6ac1d93d28df
## Listar Categorias

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuário quiser listar todas as categorias cadastradas.



## Cadastrar usuário

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuário no sistema.

- Body:

        - nome
        - email
        - senha
    
     O campo e-mail no banco de dados deve ser único para cada registro, não permitindo dois usuários possuírem o mesmo e-mail.

    #### `POST` `/login`

Essa é a rota que permite o usuário cadastrado realizar o login no sistema.

- Body:

        - email
        - senha


## Observação: 
- Todos os Endpoints a baixo necessita-se que seja passado o Token de Autenticação para " Confirmar Login"


## Listar Usuario
#### `GET` `/usuario`

- Essa é a rota que permite o usuário logado a visualizar os dados do seu próprio perfil, de acordo com a validação do token de autenticação.

## Atualizar Usuario
#### `PUT` `/usuario`

Essa é a rota que permite o usuário logado atualizar informações de seu próprio cadastro, de acordo com a validação do token de autenticação.

Body:

    campos obrigatórios:
        - nome
        - email
        - senha
   
   - O campo e-mail no banco de dados deve ser único para cada registro, não permitindo dois usuários possuírem o mesmo e-mail.

   ## Cadastrar Produto
   #### `POST` `/produto`

- Essa é a rota que permite o usuário logado cadastrar um novo produto no sistema.

Body:

    
        -   descricao
        -   quantidade_estoque
        -   valor
        -   categoria_id
        - produto_imagem (imagem escolhida) -  não é obrigatoria


## Atualizar Produto
#### `PUT` `/produto/:id`

Essa é a rota que permite o usuário logado a atualizar as informações de um produto cadastrado.

Body:

        -   descricao
        -   quantidade_estoque
        -   valor
        -   categoria_id
        - produto_imagem (imagem escolhida) -  não é obrigatoria

## Listar Produtos
#### `GET` `/produto`

- Essa é a rota que será chamada quando o usuário logado quiser listar todos os produtos cadastrados.

* Existe a query **categoria_id** para que seja possível consultar produtos por categorias, de modo, que serão filtrados de acordo com o id de uma categoria. 
Exemplo: /produto?categoria_id=2


Observações:

    - Caso seja enviado o parâmetro do tipo query **categoria_id**, o Sistema vai filtrar os produtos de acordo com a categoria, caso o id de categoria informada exista.
    - Caso não seja informado o parâmetro do tipo query **categoria_id** todos os produtos cadastrados irão ser retornados.

## Listar Produto Especifico
#### `GET` `/produto/:id`

Essa é a rota que permite o usuário logado obter um de seus produtos cadastrados. 

## Deletar Produto
#### `DELETE` `/produto/:id`

Essa é a rota que será chamada quando o usuário logado quiser excluir um de seus produtos cadastrados.  

Observação:

- o Produto não pode ser deletado caso esteja vinculado a algum pedido.

## Cadastrar Cliente
#### `POST` `/cliente`

Essa é a rota que permite usuário logado cadastrar um novo cliente no sistema.

Body:

    
        -   nome
        -   email
        -   cpf
   
   Observação:

    - O campo e-mail no banco de dados é único para cada registro, não permitindo dois clientes possuírem o mesmo e-mail.
    
    - O campo cpf no banco de dados é único para cada registro, não permitindo dois clientes possuírem o mesmo cpf.

## Atualizar Cliente
#### `PUT` `/cliente/:id`

Essa é a rota que permite o usuário realizar atualização de um cliente cadastrado.

Body:

        -   nome
        -   email
        -   cpf
   
     Observação:

    - O campo e-mail no banco de dados é único para cada registro, não permitindo dois clientes possuírem o mesmo e-mail.
    
    - O campo cpf no banco de dados é único para cada registro, não permitindo dois clientes possuírem o mesmo cpf.


## Listar Clientes 
#### `GET` `/cliente`

Essa é a rota que será chamada quando o usuário logado quiser listar todos os clientes cadastrados.

## Listar Cliente Especifico
#### `GET` `/cliente/:id`

Essa é a rota que será chamada quando o usuário logado quiser obter um de seus clientes cadastrados.  

## Cadastrar Pedido
#### `POST` `/pedido`

Essa é a rota que será utilizada para cadastrar um novo pedido no sistema.

**Observação:** Cada pedido deverá conter ao menos um produto vinculado.

**Atenção:** As propriedades produto_id e quantidade_produto devem ser informadas dentro de um array e para cada produto deverá ser criado um objeto neste array, como ilustrado no objeto de requisição abaixo.
Só deverá será cadastrado o pedido caso todos produtos vinculados ao pedido realmente existão no banco de dados.


-  Exemplo de Corpo da requisição para cadastro de pedido (body)
{

"cliente_id": 1,

"observacao": "Em caso de ausência recomendo deixar com algum vizinho",

"pedido_produtos": [

        {
            "produto_id": 1,
            "quantidade_produto": 10
        },
        {
            "produto_id": 2,
            "quantidade_produto": 20
        }
   ]
}

Body:

     campos obrigatórios:
        -   cliente_id
        -   pedido_produtos
            -   produto_id
            -   quantidade_produto


##  Listar Pedidos
#### `GET` `/pedido`

Essa é a rota que será chamada quando o usuário logado quiser listar todos os pedidos cadastrados.

- Observação: 
 parâmetro do tipo query **cliente_id** para que seja possível consultar pedidos por clientes, de modo, que serão filtrados de acordo com o id de um cliente.

 Exemplo: /pedido?cliente_id=1



       



    







