from requests import get, post, put, delete
import base64

base_url = 'http://localhost:8000'

def decodeTokenBody(token: str):
    return base64.b64decode(token.split('.')[1] + "==")

token_admin = post(f'{base_url}/login', json={
    "username": "talent", "password": "nu"
    }).json()['token']

token_doctor1 = post(f'{base_url}/login', json={
    "username": "doctor1", "password": "nu"
    }).json()['token']

token_doctor3 = post(f'{base_url}/login', json={
    "username": "doctor3", "password": "nu"
    }).json()['token']

token_patient1 = post(f'{base_url}/login', json={
    "username": "patient1", "password": "nu"
    }).json()['token']

token_patient3 = post(f'{base_url}/login', json={
    "username": "patient3", "password": "nu"
    }).json()['token']

token_tc = post(f'{base_url}/login', json={
    "username": "tc", "password": "nu"
    }).json()['token']

req_resp = get(f'{base_url}/users/all_patients/', headers={'Authorization': f'Bearer {token_doctor3}'})


print(decodeTokenBody(token_patient1))
