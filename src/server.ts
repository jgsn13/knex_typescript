import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import routes from './routes';

const app = express();

app.use(cors());
// Use case example:
// app.use(cors({
//   origin: ['dominio1.com', 'dominio2.com']
// }));

app.use(express.json());

app.use((request, _response, next) => {
  const { method, url } = request;
  const formatedMethod =
    method === 'GET'
      ? '\x1b[32mGET\x1b[0m'
      : method === 'POST'
      ? '\x1b[33mPOST\x1b[0m'
      : method === 'PUT'
      ? '\x1b[34mPUT\x1b[0m'
      : method === 'PATCH'
      ? '\x1b[37mPATCH\x1b[0m'
      : method === 'DELETE\x1b[0m'
      ? '\x1b[31mDELETE'
      : `${method}`;

  console.log(`[${formatedMethod}] ${url}`);

  return next();
});

app.use(routes);

// Providing static content from the uploads folder in the /uploads route.
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

const port = 3000;

app.listen(port, () => {
  console.clear();
  console.log(`🔥 Server started on port ${port}!`);
});
