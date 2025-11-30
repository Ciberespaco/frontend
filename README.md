## 📄 Sobre o Projeto
Este projeto é a interface de usuário (Frontend) do sistema de gestão desenvolvido para a Associação Valadarense de Artesãos, Artistas e Gastronomia Típica – Ponto de Artes e Sabores. O objetivo principal é modernizar e automatizar as operações da associação, substituindo processos manuais e sistemas legados (como Microsoft Access) por uma solução web moderna, eficiente e centralizada.

- Gestão de Artesãos e Produtos: Cadastro detalhado de membros e seus respectivos produtos.

- Balcão de Pedidos: Interface ágil para registro de pedidos, com cálculo automático de comissões e taxas.

- Controle de Estoque: Atualização automática do inventário a cada venda.

- Gestão Financeira: Ferramentas para controle de caixa e futuros relatórios.

- Administração de Dados: Módulos para gerenciar categorias, matérias-primas e técnicas artesanais.

## ✨ Tecnologias Utilizadas
### A aplicação foi construída utilizando um conjunto de tecnologias modernas para garantir uma experiência de desenvolvimento e de usuário de alta qualidade:

- Framework Principal: Nuxt.js - Um framework progressivo baseado em Vue.js para criar aplicações web universais e de página única (SPA).

- Linguagem: TypeScript - Para adicionar tipagem estática ao JavaScript, aumentando a robustez e a manutenibilidade do código.

- Estilização: Tailwind CSS - Um framework CSS "utility-first" para criar designs customizados de forma rápida e consistente.

- Componentes de UI: Shadcn-Vue - Uma coleção de componentes de interface reutilizáveis e acessíveis.

- Gerenciamento de Estado: Pinia - A biblioteca de gerenciamento de estado oficial para Vue.js, utilizada para centralizar os dados da aplicação (como autenticação e dados de entidades).

### Formulários e Validação:

- Vee-Validate - Para orquestrar a validação de formulários.

- Zod - Para definir schemas de dados e garantir a integridade das informações antes do envio para o backend.

- Cliente HTTP: Axios - Para realizar as requisições à API do backend de forma segura e padronizada.

- Linting e Formatação: ESLint e Prettier para manter a qualidade e a consistência do código.

## 🚀 Instalação e Execução Local
Para executar este projeto em seu ambiente de desenvolvimento local, siga os passos abaixo.

### Pré-requisitos
- Node.js (versão LTS recomendada)

- NPM (geralmente instalado com o Node.js)

## Passos

### Clone o repositório:
```bash



$ git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
```
### Acesse o diretório do projeto:

```bash

$ cd Ciberespaco-frontend-cb09510c9571ebcd482b4531440a4393f3f5e584
```
### Configure as variáveis de ambiente:
Copie o arquivo de exemplo .env.example para um novo arquivo chamado .env.


```bash 
$ cp .env.example .env
```
Abra o arquivo .env e configure a variável BACKEND_URL com o endereço da API do backend que esta aplicação irá consumir.
```bash
BACKEND_URL=http://example
``` 
Instale as dependências do projeto:


```bash 
$ npm install
``` 
Inicie o servidor de desenvolvimento:
 ```bash 
$ npm run dev
```

### Acesse a aplicação:
Abra seu navegador e acesse http://localhost:3000. A aplicação estará em execução.

## 🔗 Integrações
### A arquitetura do projeto segue o modelo cliente-servidor. Esta aplicação (Frontend) é totalmente desacoplada e sua principal integração é com a API do Backend.

Backend API: O frontend consome uma API RESTful (não inclusa neste repositório) que é responsável por:

- Gerenciar toda a lógica de negócio.

- Processar a autenticação e autorização de usuários.

- Persistir os dados em um banco de dados.

- Realizar as operações de CRUD (Create, Read, Update, Delete) para todas as entidades do sistema (artesãos, produtos, vendas, etc.).

### *** É essencial que a API do backend esteja em execução e acessível na URL configurada no arquivo .env para que o frontend funcione corretamente. ***

## 👥 Equipe de Desenvolvimento
Igor Coelho Brasil

Matheus Alves Barroso

