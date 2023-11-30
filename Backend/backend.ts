import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express()
const port = 3000

app.use(bodyParser.json())

type loginForm = {
  username: string,
  email: string,
  password: string,
  isMedic: boolean
}

app.post('/login', (req: Request<{}, {}, loginForm>, res: Response) => {
  console.log(req.body.email);

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})