from requests import get, post, put

base_url = 'http://localhost:8000'

token_doctor1 = post(f'{base_url}/login', json={
    "username": "doctor1", "password": "nu"
    }).json()['token']

token_patient1 = post(f'{base_url}/login', json={
    "username": "patient1", "password": "nu"
    }).json()['token']

# personal_requests = get(f'{base_url}/acc_data/personal_requests', headers={'Authorization': f'Bearer {token_doctor1}'})
# personal_requests = get(f'{base_url}/patients', headers={'Authorization': f'Bearer {token_doctor1}'})
personal_requests = put(f'{base_url}/acc_data/request', headers={'Authorization': f'Bearer {token_patient1}'}, json={"to": "doctor1"})
print(personal_requests.json())