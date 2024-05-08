import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { backend_url, orthanc_url } from '../configs/backend_url';
import { accountDataListEntry } from '../types/ListEntry';
import { parseJwt } from '../utils/helper';

global.Buffer = global.Buffer || require('buffer').Buffer

async function getDoctors(token: string): Promise<Array<accountDataListEntry>> {
  let resp;
  try {
    resp = await axios.get(`${orthanc_url}/users/all_doctors/`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get patients");
    return null;
  };
  return resp.data;
}

async function demoteDoc(token: string, docUsername: string) {
  let resp;
  try {
    if(parseJwt(token)?.role !== 'admin') {
      throw new Error('Not the admin');
    }
    resp = await axios.put(`${backend_url}/acc_data/admin/demote`,
      {
        doc_username: docUsername
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

export {
    getDoctors,
    demoteDoc
};