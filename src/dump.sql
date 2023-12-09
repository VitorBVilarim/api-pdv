create database pdv;

create table usuarios(
id serial primary key,
nome text not null,
email text not null unique,
senha text not null
);

create table categorias(
id serial primary key,
descricao text not null
);

insert into categorias(descricao)
values 
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos(
  id serial primary key,
  descricao text not null,
  quantidade_estoque int not null,
  valor int not null,
  categoria_id text references categorias(id)
);


create table clientes(
id serial primary key,
nome varchar(30) ,
email text unique,
cpf text unique ,
cep text ,
rua text ,
numero int ,
bairro text ,
cidade text ,
estado text 
);