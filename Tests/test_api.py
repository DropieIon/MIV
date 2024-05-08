from requests import get, post, put, delete
import base64

base_url = 'http://localhost:8000'

def decodeTokenBody(token: str):
    return base64.b64decode(token.split('.')[1] + "==")

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

# req_resp = put(f'{base_url}/acc_data/details/', headers={'Authorization': f'Bearer {token_tc}'},
#                json={
#                    "fullName":'test',
#                     "age": 1,
#                     "sex": 'M',
#                    "profile_picB64": ''
#                })

# req_resp = get(f'{base_url}/all_studies', headers={'Authorization': f'Bearer {token_doctor3}'})
# req_resp = get(f'{base_url}/users/all_doctors/', headers={'Authorization': f'Bearer {token_patient3}'})
# req_resp = delete(f'{base_url}/acc_data/studies/', headers={'Authorization': f'Bearer {token_doctor1}'},
#                   json={
#                       "study_id": "14d74df9-be0fb9f4-a88c5382-55c94913-b46b297a",
#                       "patient_username": "patient1"
#                   })

req_resp = put(f'{base_url}/acc_data/studies/unassign', headers={'Authorization': f'Bearer {token_patient1}'},
                  json={
                      "study_id": "941a16e6-2b969e8a-d3e9e31a-1bbc74f6-abcad8c3",
                    #   "study_id": "750255f1-a6d57cdf-6f7692af-b6eb20e8-76b2cd54",
                      "patient_username": "patient1"
                  })

print(req_resp.status_code)
print(req_resp.json())
# print(len(req_resp.json()))

