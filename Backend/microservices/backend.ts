import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from '../src/middlewares/errors.middleware';

const app = express();
const port = 3000;

/* Middleware */

app.use(json())

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.get('/studies', (req, res) => {
  res.json({message: "bravo fratic"})
})


/* Error handler middleware */
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})