import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { orthanc_url } from '../configs/backend_url';
import { accountDataListEntry } from '../types/ListEntry';

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

export {
    getDoctors
};