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

@sio.event
async def news(data):
    print('message received with ', data)

@sio.event
async def message(data):
    print('message received with ', data)
    await sio.emit('message', {'response': 'my response'})

@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    await sio.connect(f'http://localhost:8000/', headers={'Authorization': f'Bearer {token_patient1}'})
    await sio.wait()

asyncio.run(main())