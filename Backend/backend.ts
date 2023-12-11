import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { insert_user } from './db_requests';
import crypto from 'crypto';
import { generateAccessToken, authenticateToken } from './jwt_handlers';


const app = express()
const port = 3000

const sha256 = (x: string) => crypto.createHash('sha256').update(x, 'utf8').digest('hex');

app.use(bodyParser.json())

type loginForm = {
  username: string,
  email: string,
  password: string,
  isMedic: boolean
}

app.post('/login', (req: Request<{}, {}, loginForm>, res: Response) => {
  console.log(req.body);
  
  insert_user(req.body.username, sha256(req.body.password));
  res.send({token: generateAccessToken(req.body.username)});
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})