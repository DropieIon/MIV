import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { accountDataListEntry } from '../types/ListEntry';
import { parseJwt } from '../utils/helper';
import { store } from '../store';

global.Buffer = global.Buffer || require('buffer').Buffer

// const backend_url = store.getState().serverAddress;
// const orthanc_url = backend_url;

async function getDoctors(token: string): Promise<Array<accountDataListEntry>> {
  let resp;
  try {
    resp = await axios.get(`${store.getState().serverAddress}/users/all_doctors/`,
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
    resp = await axios.put(`${store.getState().serverAddress}/acc_data/admin/demote`,
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