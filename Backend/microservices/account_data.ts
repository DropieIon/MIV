import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from '../src/middlewares/errors.middleware';
import personal_requests_router from '../src/routes/account_data/personal_requests.route';
import request_router from '../src/routes/account_data/request.route';
import details_router from '../src/routes/account_data/details.route';
import { get_pool } from '../src/services/db/db-functions';
import fileUpload from 'express-fileupload';
import { parseDicom } from 'dicom-parser';
import { Server as ServerIO } from "socket.io";

const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
const io = new ServerIO(server);

io.on('connection', function (socket) {
  socket.on('split-file', () => {});
});

/* Middleware */

app.use(json({limit: '50mb'}));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})


app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  let dicomFile = req.files.uploadDicom;

  if (Array.isArray(dicomFile)) {
  }
  else {
    const StudyInstanceUID = parseDicom(dicomFile.data).string('x0020000d');
    fetch('http://orthanc:8042/instances', {
      method: 'POST',
      body: dicomFile.data
    })
      .then(() => {
        fetch('http://orthanc:8042/tools/find', {
          method: 'POST',
          body: `{"Level" : "Study", "Expand":true, "Query" : {"StudyInstanceUID" : "${StudyInstanceUID}"} }`
        }).
          then(async (data) => {
            const resp: any = await data.json();
            console.log(resp[0].ID);

          })
          .catch((err) => {
            console.log(err);

          });

      })
      .catch((err) => {
        console.log(err);

      })
    res.send('File uploaded!');
  }
});



app.use('/personal_requests', personal_requests_router);
app.use('/request', request_router);
app.use('/details', details_router);

/* Error handler middleware */
app.use(errorHandler);

/* Cleanup */

process.stdin.resume(); // so the program will not close instantly

type exitOptions = {
  cleanup?: boolean,
  exit?: boolean
}

function exitHandler(options: exitOptions) {
    if (options.cleanup) {
      console.log("Closed connection pool");
      get_pool().end();
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