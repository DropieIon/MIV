import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from '../src/middlewares/errors.middleware';
import personal_requests_router from '../src/routes/account_data/personal_requests.route';
import request_router from '../src/routes/account_data/request.route';
import details_router from '../src/routes/account_data/details.route';
import upload_router from '../src/routes/account_data/upload.route';
import studies_router from '../src/routes/account_data/studies.route';
import admin_router from '../src/routes/account_data/admin.route';
import { get_pool } from '../src/services/db/db-functions';
import fileUpload from 'express-fileupload';
import { Server as ServerIO } from "socket.io";
import { sfProtocol } from '../src/services/account_data/socket.io/sfProtocol.service';
import { sockGetMsgs, sockReceiveMsg } from '../src/services/account_data/socket.io/studyChat.service';
import { getMessageListReq, messageOverWS } from '../../Common/types';

const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
const io = new ServerIO(server, {
  maxHttpBufferSize: 1e8,
});

io.on('connection', function (socket) {  
  switch(socket.handshake.headers.conntype) {
    case 'upload':
      // protocol: sends size and nr of packets first
      // then sends the n nr of packets
      // then an EOS (end of stream) and a checksum
      console.log("Upload client connected");
      const sf = new sfProtocol(socket);
      break;
    case 'study-chat':
      console.log("Study chat connected");
      socket.on('msg-to-serv', (data: messageOverWS) => {
        sockReceiveMsg(socket, data);
      });
      socket.on('get-messages', (data: getMessageListReq) => {
        const {
          recvUser,
          study_id
        } = data;
        sockGetMsgs(socket, recvUser, study_id);
      });
      break;
    default:
      break;
  }
});

/* Middleware */

app.use(json({limit: '50mb'}));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/personal_requests', personal_requests_router);
app.use('/request', request_router);
app.use('/details', details_router);
app.use('/upload', upload_router);
app.use('/studies', studies_router);
app.use('/admin', admin_router);

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