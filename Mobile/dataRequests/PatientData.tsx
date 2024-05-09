import axios, { AxiosError, AxiosResponse } from 'axios';
import { backend_url, orthanc_url } from '../configs/backend_url';
import { accountDataListEntry } from '../types/ListEntry';
import { parseJwt } from '../utils/helper';

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

type patDetails = {
  fullName: string,
  birthday: string,
  gender: string,
  profile_picB64: string
}

async function promotePat(token: string, patUsername: string) {
  let resp;
  try {
    if(parseJwt(token)?.role !== 'admin') {
      throw new Error('Not the admin');
    }
    resp = await axios.put(`${backend_url}/acc_data/admin/promote`,
      {
        patient_username: patUsername
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not promote patient " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}

async function getPfp(token: string, username: string) {
  let resp;
  try {
    resp = await axios.post(`${backend_url}/acc_data/details/pfp`,
      {
        username
      },
      { headers: { 'Authorization': 'Bearer ' + token } },
    )
  }
  catch (error) {
    const errData: any = (error as AxiosError).response.data;
    if(errData.message === "No pfp for user") {      
      return "";
    }
    console.error("Could not get pfp for user " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}

async function putPatientDetails(token: string, patDetails: patDetails) {
  let resp;
  try {
    if(parseJwt(token)?.role === 'med') {
      throw new Error('Not a patient');
    }
    resp = await axios.put(`${backend_url}/acc_data/details/`,
      {
        fullName: patDetails.fullName,
        birthday: patDetails.birthday,
        sex: patDetails.gender,
        profile_picB64: patDetails.profile_picB64
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not put patient details " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}

async function allowUnlimUploads4h(token: string, patUsername: string) {
  let resp;
  try {
    if (parseJwt(token)?.role === 'pat') {
      throw new Error('Not a medic');
    }
    resp = await axios.put(`${backend_url}/acc_data/upload/allowUnlim/`,
      {
        patient_username: patUsername
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not grant permission to patient " + (error as AxiosError).message);
    return null;
  };
  return resp.data;
}

async function assignToPatient(token: string, studyID: string, patUsername: string) {
  let resp;
  try {
    if (parseJwt(token)?.role === 'pat') {
      throw new Error('Not a medic');
    }
    resp = await axios.put(`${backend_url}/acc_data/studies/assign`,
      {
        patient_username: patUsername,
        study_id: studyID
      },
      {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    )
  }
  catch (error) {
    console.error("Could not assign study to patient " + (error as AxiosError).message);
    return null;
  };
  return resp.data;  
}



export {
  getPatients,
  getPatientStudies,
  putPatientDetails,
  getPfp,
  allowUnlimUploads4h,
  assignToPatient,
  promotePat,
};