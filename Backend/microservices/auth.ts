import express from 'express';
import { json } from 'body-parser';
import loginRouter from '../src/routes/login.route';
import registerRouter from '../src/routes/register.route';
import { errorHandler } from '../src/middlewares/errors.middleware';


const app = express();
const port = 3000;


/* Middleware */

app.use(json())

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/login', loginRouter);

app.use('/register', registerRouter);

/* Error handler middleware */
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})