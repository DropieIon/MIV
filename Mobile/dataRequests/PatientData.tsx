import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { orthanc_url } from '../configs/backend_url';
import { patientsListEntry } from '../types/ListEntry';

global.Buffer = global.Buffer || require('buffer').Buffer

async function getPatients(token: string): Promise<Array<patientsListEntry>> {
  let resp;
  try {
    resp = await axios.get(`${orthanc_url}/patients/`,
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
    console.error("Could not get studies for patient");
    return null;
  };
  return resp.data;
}



export {
  getPatients,
  getPatientStudies
};