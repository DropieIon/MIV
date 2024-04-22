import asyncio
import socketio
from requests import post

sio = socketio.AsyncClient()

base_url = 'http://localhost:8000'

token_patient1 = post(f'{base_url}/login', json={
    "username": "patient1", "password": "nu"
    }).json()['token']

@sio.event
async def connect():
    print('connection established')
    await sio.emit('split-file', {'type': 'handshake', "token": token_patient1, 'size': 25, 'nrOfPackets': 4})
    with open('/home/ion/Downloads/ion.ciubotaru.zip', 'rb') as f:
        await sio.emit('split-file', {'type': 'splitFile', 'data': f.read(int(25 * 1024 / 4))})
    await sio.emit('EOS', {'md5': ''})


@sio.event
async def disconnect():
    print('disconnected from server')


@sio.event
async def err(msg):
    print('err from server' + str(msg))

async def main():
    await sio.connect(f'http://localhost:8000/', headers={'Authorization': f'Bearer {token_patient1}'})
    await sio.wait()

asyncio.run(main())