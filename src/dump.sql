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
nome varchar(30) not null,
email text unique not null,
cpf text unique not null,
cep text not null,
rua text not null,
numero int not null,
bairro text not null,
cidade text not null,
estado text not null
);