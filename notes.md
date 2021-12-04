# Typescript
- Instalar typescript só pra desenvolvimento.
- O typescript quase nunca vai saber/encontrar das declarações dos tipos das
  bibliotecas que estamos usando, por isso, sempre lembra de instalar os tipos,
  por exemplo os do express: `yarn add @types/express -D`
- Podemos iniciar o *tsconfig.json* na raiz do projeto com o tsc `tsc --init`.
- Podemos configurar o `rootDir` e `outDir` no *tsconfig.json*, esses arquivos são 
  referentes a pasta raiz e a pasta de compilação do projeto, respectivamente.
- Podemo compilar o projeto com o tsc, será criada uma pasta de acordo com o que
  colocamos no *tsconfig.json*.

# ts-node-dev
- Instalar o pacote ts-node-dev só para desenvolvimento.
- Agora basta adicionar o seguinte script no *package.json*:
  `"dev": "ts-node-dev --inspect --ignore-watch node_modules src/server.ts"`.

# Nodemon
- Instalar ts-node e nodemon só para desenvolvimento.
-  Agora basta adicionar o seguinte script no *package.json*:
  `"dev": "nodemon --watch 'src/' --exec 'ts-node src/server.ts' -e ts"`.
- A flag `-e` significa que o nodemon vai observar apenas os arquivos com a extensão *.ts*.

# Router
- Se quisermos colocar as rotas em outro arquivo, teremos que usar o Router do express,
  pois ele só é disponibilizado no arquivo onde criamos a instância do express, fora dele
  temos que importar o seguinte: `import { Router } from 'express'`.
- O arquivo com as rotas vai ter essa cara:
``` typescript
import { Router } from 'express';

const routes = Router();

export default routes;
```
- Lembrando que tudo o que faziamos para as rotas com a instância *app* do express,
  podemos fazer agora com a a instância *router* do Router.
- Logo em seguida, no arquivo da instância do express, basta importar o arquivo principal
  das rotas e usar assim: `app.use(routes)`.

# Knex.js
- Podemos usar um query builder para usarmos um banco de dados, como o Knex.js.
- Basta instalar o pacote `knex` e o driver do banco de dados.

# Migrations
- Migrations são como um histórico no banco de dados, facilita o desenvolvimento de aplicações escaláveis.
- Knex tem uma ótima documentação.
- Comandos para rodar as migrations:
```
yarn knex --knexfile knexfile.ts migrate:latest
```
