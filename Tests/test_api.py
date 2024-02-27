from requests import get, post

base_url = 'http://localhost:8000'

token_doctor1 = post(f'{base_url}/login', json={
    "username": "patient1", "password": "nu"
    }).json()['token']

personal_requets = get(f'{base_url}/acc_data/personal_requests', headers={'Authorization': f'Bearer {token_doctor1}'})
print(personal_requets.json())