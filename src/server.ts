import express from 'express';
import { resolve } from 'path';
import routes from './routes';

const app = express();

app.use(routes);

// Providing static content from the uploads folder in the /uploads route.
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

const port = 3333;

app.listen(port, () => {
  console.log(`🔥 Server started on port ${port}!`);
});
