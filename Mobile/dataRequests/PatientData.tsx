import axios, { AxiosError, AxiosResponse } from 'axios';
import { backend_url, orthanc_url } from '../configs/backend_url';
import { accountDataListEntry } from '../types/ListEntry';

global.Buffer = global.Buffer || require('buffer').Buffer

async function getPatients(token: string): Promise<Array<accountDataListEntry>> {
  let resp;
  try {
    resp = await axios.get(`${backend_url}/users/patients/`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get patients");
    return null;
  };
  return resp.data;
}

async function getPatientStudies(patient_uid: string, token: string) {
  let resp;
  try {
    resp = await axios.get(`${orthanc_url}/patients/${patient_uid}`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get studies for patient " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}



export {
  getPatients,
  getPatientStudies
};