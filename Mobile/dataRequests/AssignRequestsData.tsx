import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { backend_url, orthanc_url } from '../configs/backend_url';
import { requestsListEntry } from '../types/ListEntry';
import { parseJwt } from '../utils/helper';
import { accountDataListEntry } from '../types/ListEntry'

global.Buffer = global.Buffer || require('buffer').Buffer;

async function getRequests(token: string): Promise<Array<requestsListEntry>> {
  let resp;
  try {
    resp = await axios.get(`${backend_url}/acc_data/personal_requests/`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get personal requests");
    return null;
  };
  let index = 0;
  return resp.data.map(obj => ({...obj, uid: (index++).toString()}));
}

async function getAllPatients(token: string): Promise<accountDataListEntry[]> {
  let resp;

  try {
    if(parseJwt(token)?.isMedic === 'N') {
      throw new Error('Not a medic');
    }
    resp = await axios.get(`${backend_url}/all_patients/`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get requestable patients list");
    return null;
  };
  return resp.data;
}

async function answerReq(token: string, patient_username: string, isAccepted: boolean) {
  let resp;

  try {
    if(parseJwt(token)?.isMedic === 'N') {
      throw new Error('Not a medic');
    }
    resp = await axios.post(`${backend_url}/acc_data/requests/${isAccepted ? 'accept' : 'deny'}`,
      { headers: { 'Authorization': 'Bearer ' + token },
        patient_username: patient_username
      },
    )
  }
  catch (error) {
    console.error("Could not answer request");
    return null;
  };
  return resp.data;
}

export {
  getRequests,
  getAllPatients,
  answerReq
};