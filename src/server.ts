import express from "express";
import cors from "cors";
import { resolve } from "path";
import { errors } from "celebrate";
import routes from "./routes";
import requestLogger from "./middlewares/requestLogger";

const app = express();

app.use(cors());
// Use case example:
// app.use(cors({
//   origin: ['dominio1.com', 'dominio2.com']
// }));

app.use(express.json());

app.use(requestLogger);

app.use(routes);

// Providing static content from the uploads folder in the /uploads route.
app.use("/uploads", express.static(resolve(__dirname, "..", "uploads")));

// Parsing celebrate errors
app.use(errors());

const port = 3000;

app.listen(port, () => {
  console.clear();
  console.log(`🔥 Server started on port ${port}!`);
});
