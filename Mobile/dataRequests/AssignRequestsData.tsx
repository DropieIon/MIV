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
    console.error("Could not get personal requests", (error as AxiosError).response.data);
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
    resp = await axios.get(`${backend_url}/users/all_patients/`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get requestable patients list");
    return null;
  };
  return resp.data;
}

async function makeRequest(token: string, medic_username: string) {
  let resp;
  
  try {
    if(parseJwt(token)?.isMedic === 'Y') {
      throw new Error('Not a patient');
    }
    resp = await axios.put(`${backend_url}/acc_data/request/`,
      {
        to: medic_username
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not make request", error);
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
    resp = await axios.put(`${backend_url}/acc_data/request/${isAccepted ? 'accept' : 'decline'}`,
    {
      patient_username: patient_username
    },
    {
      headers: { 'Authorization': 'Bearer ' + token }
    },
    )
  }
  catch (error) {
    console.error("Could not answer request " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}

async function assignPatient(token: string, patient_username: string) {
  let resp;
  
  try {
    if(parseJwt(token)?.isMedic === 'N') {
      throw new Error('Not a doctor');
    }
    resp = await axios.put(`${backend_url}/acc_data/request/assign`,
      {
        patient_username: patient_username
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not make assignment", error);
    return null;
  };
  return resp.data;
  
}

async function unassignPatient(token: string, patient_username: string) {
  let resp;
  
  try {
    if(parseJwt(token)?.isMedic === 'N') {
      throw new Error('Not a doctor');
    }
    resp = await axios.put(`${backend_url}/acc_data/request/unassign`,
      {
        patient_username: patient_username
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not unassign patient", error);
    return null;
  };
  return resp.data;
}

export {
  getRequests,
  getAllPatients,
  makeRequest,
  answerReq,
  assignPatient,
  unassignPatient
};