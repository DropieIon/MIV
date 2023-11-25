import axios from 'axios';

global.Buffer = global.Buffer || require('buffer').Buffer 


let url = "http://10.41.41.89:8042";

interface frames_resp {
    data: Array<number>
}

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

async function getAllPatients(): Promise<Array<string>> {
    let resp = await axios.get(`${url}/patients/`);
    return resp.data;
}

async function getStudies(patient_id: string): Promise<Array<string>> {
    let resp: patients_resp = await axios.get(`${url}/patients/${patient_id}`);
    return resp.data.Studies;
}

async function getSeries(study_id: string): Promise<Array<string>> {
    let resp: studies_resp = await axios.get(`${url}/studies/${study_id}`);
    return resp.data.Series;
}

async function getInstances(serie_id: string): Promise<Array<string>> {
  let resp: series_resp = await axios.get(`${url}/series/${serie_id}`);
  return resp.data.Instances;
}

async function getFrames(instance_id: string): Promise<Array<number>> {
  let resp: frames_resp = await axios.get(`${url}/instances/${instance_id}/frames`);
  return resp.data;
}

async function getJpeg(instance_id: string, frame_nr: number): Promise<string> {
  let resp = await axios.get(`${url}/instances/${instance_id}/frames/${frame_nr}/rendered`, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(resp.data, 'binary').toString('base64');
}

async function getPatient(patient: string) {
}



async function getViewerImages(patient_id: string) {
  // get Patient -> studies -> series -> instances -> frames -> jpegs


  // TODO: change this to something more appropriate
  let all_frames: Array<string> = [];

  let studies = await getStudies(patient_id);
  for (const index_studies in studies) {
    let series_list = await getSeries(studies[index_studies]);
    for (const index_series in series_list) {
      let instances_list = await getInstances(series_list[index_series])
      for (const index_instaces in instances_list) {
        let instance_id = instances_list[index_instaces];
        let frames_list = await getFrames(instance_id);
        for (let index_frames = 0; index_frames < frames_list.length; index_frames++) {
            let frame = await getJpeg(instance_id, frames_list[index_frames]);
            all_frames.push(frame);
        }
      }
    }
  }
  return all_frames;

}

export {
    getViewerImages,
    getAllPatients
};