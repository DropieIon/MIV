import axios, { AxiosError } from 'axios';
import { orthanc_url } from '../configs/backend_url';
import { imageListItem } from '../types/ListEntry';
import { viewerData } from '../types/ViewerData';

global.Buffer = global.Buffer || require('buffer').Buffer

interface series_resp {
  data: {
    ID: string,
    Instances: Array<string>,
    ParentStudy: string,
    MainDicomTags: {
      Modality: string,
      SeriesDescription: string,
      StationName: string
    }
  }
}

interface studies_resp {
  data: {
    ID: string,
    StudyID: string,
    ParentPatient: string,
    PatientMainDicomTags: {
      PatientName: string,
      PatientSex: string
    },
    Series: Array<string>
  }
}

interface patients_resp {
  data: {
    ID: string,
    PatientName: string,
    MainDicomTags: {
      PatientID: string,
      PatientName: string
    },
    Studies: Array<string>
  }
}

async function getAllPatients(token: string): Promise<Array<string>> {
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

async function getStudies(patient_id: string, token: string): Promise<Array<string>> {
  let resp: patients_resp;
  try {
    resp = await axios.get(`${orthanc_url}/patients/${patient_id}`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get studies");
    return null;
  };
  return resp.data.Studies;
}

async function getSeries(study_id: string, token: string): Promise<Array<string>> {
  let resp: studies_resp;
  try {
    resp = await axios.get(`${orthanc_url}/studies/${study_id}`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  }
  catch (error) {
    console.error("Could not get series");
    return null;
  }
  return resp.data.Series;
}

async function getInstances(serie_id: string, token: string): Promise<Array<string>> {
  let resp: series_resp;
  try {
    resp = await axios.get(`${orthanc_url}/series/${serie_id}`,
      { headers: { 'Authorization': 'Bearer ' + token } }
    )
  } catch (error) {
    console.error("Could not get instances");
    return null;
  }
  return resp.data.Instances;
}
async function getJpeg(instance_id: string, token: string): Promise<string> {
  let resp;
  try {
    resp = await axios.get(`${orthanc_url}/instances/${instance_id}/rendered`, {
      responseType: 'arraybuffer', headers: { 'Authorization': 'Bearer ' + token }
    })
  }
  catch (e) {
    console.error("Could not get image");
    return null;
  }
  return Buffer.from(resp.data, 'binary').toString('base64');
  // return resp.data;
}

async function getPreview(instance_id: string, token: string) {
  let resp;
  try {
    resp = await axios.get(`${orthanc_url}/instances/${instance_id}/preview`, {
      responseType: 'arraybuffer', headers: { 'Authorization': 'Bearer ' + token }
    })
  }
  catch (e) {
    console.error("Could not get preview");
    return null;
  }
  return Buffer.from(resp.data, 'binary').toString('base64');
}

async function getPatient(patient: string, token: string) {
}

async function getSeriesData(series_id: string, token: string): Promise<imageListItem[]> {
  const instances_list = await getInstances(series_id, token);
  let series_data: imageListItem[] = [];
  let img_data, preview_data;
  for (const index_instaces in instances_list) {
    let instance_id = instances_list[index_instaces];
    img_data = await getJpeg(instance_id, token);
    series_data.push({ ind: parseInt(index_instaces), data: img_data});
  }
  return series_data;
}


async function getViewerImages(study_id: string, token: string) {
  // get studies -> series -> instances

  let all_frames: Array<viewerData> = [];
  let promise_list = [];
      let series_list = await getSeries(study_id, token);
      for (const index_series in series_list) {
        const series_id = series_list[index_series];
        promise_list.push(
          getSeriesData(series_id, token)
            .then((series_data) => {
              all_frames.push({ ind: parseInt(index_series), series: series_data})
            })
        );
  }
  const rez = await Promise.all(promise_list);
  return all_frames;
}

export {
  getStudies,
  getViewerImages,
  getAllPatients
};