import express from 'express';
import { json } from 'body-parser';
import loginRouter from '../src/routes/auth/login.route';
import registerRouter from '../src/routes/auth/register.route';
import { errorHandler } from '../src/middlewares/errors.middleware';
import { get_pool } from '../src/services/db/db-functions';


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

/* Cleanup */

process.stdin.resume(); // so the program will not close instantly

type exitOptions = {
  cleanup?: boolean,
  exit?: boolean
}

function exitHandler(options: exitOptions) {
    if (options.cleanup) {
      console.log("Closed connection pool");
      return get_pool().end().then();
    }
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));