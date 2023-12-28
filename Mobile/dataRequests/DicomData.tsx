import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { orthanc_url } from '../configs/backend_url';
import { imageListItem } from '../types/ListEntry';
import { viewerData } from '../types/ViewerData';
import { AnyAction, Dispatch } from 'redux';
import { parseJwt } from '../utils/helper';

global.Buffer = global.Buffer || require('buffer').Buffer

type studiesListEntry = {
    study_id: string,
    modality: string,
    date: string,
    preview: string,
    assignee: string
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

type stateFunctions = {
    dispatch: Dispatch<AnyAction>,
    setLoadingProgress
}

async function getStudies(token: string): Promise<Array<studiesListEntry>> {
    let resp: AxiosResponse<studiesListEntry[]>;
    try {
        resp = await axios.get(`${orthanc_url}/studies`,
            { headers: { 'Authorization': 'Bearer ' + token } }
        )
    }
    catch (error) {
        console.error("Could not get studies", error);
        return null;
    };
    return resp.data;
}

async function getSeries(study_id: string, token: string): Promise<Array<string>> {
    let resp: studies_resp;
    try {
        if(parseJwt(token).isMedic === 'Y') {
            console.log(study_id);
            
            resp = await axios.post(`${orthanc_url}/studies/${study_id}`, {},
                { headers: { 'Authorization': 'Bearer ' + token } }
            )
        }
        else {            
            resp = await axios.get(`${orthanc_url}/studies/${study_id}`,
                { headers: { 'Authorization': 'Bearer ' + token } }
            )
        }
    }
    catch (error) {
        console.error("Could not get series", error);
        return null;
    }
    return resp.data.Series;
}

async function getInstances(serie_id: string, token: string): Promise<Array<string>> {
    let resp: series_resp;
    try {
        if(parseJwt(token).isMedic === 'Y') {
            resp = await axios.post(`${orthanc_url}/series/${serie_id}`, {},
                { headers: { 'Authorization': 'Bearer ' + token } }
            )    
        }
        else {
            resp = await axios.get(`${orthanc_url}/series/${serie_id}`,
                { headers: { 'Authorization': 'Bearer ' + token } }
            )
        }
    } catch (error) {
        console.error("Could not get instances");
        return null;
    }
    return resp.data.Instances;
}

async function getJpeg(instance_id: string, token: string): Promise<string> {
    let resp;
    try {
        if(parseJwt(token).isMedic === 'Y') {
            resp = await axios.post(`${orthanc_url}/instances/${instance_id}`, {},
                { responseType: 'arraybuffer', headers: { 'Authorization': 'Bearer ' + token } }
            )    
        }
        else {
            resp = await axios.get(`${orthanc_url}/instances/${instance_id}`, {
                responseType: 'arraybuffer', headers: { 'Authorization': 'Bearer ' + token }
            })
        }
    }
    catch (e) {
        console.error("Could not get image", e);
        return null;
    }
    return Buffer.from(resp.data, 'binary').toString('base64');
}


async function getSeriesData(instances_list: string[], token: string,
    loading_data: imageListItem[][], series_index: number, functions: stateFunctions)
    : Promise<imageListItem[]> {
    const {
        dispatch,
        setLoadingProgress
    } = functions;
    let series_data: imageListItem[] = [];
    let img_data: string;
    let counter = 0;
    for (const index_instaces in instances_list) {
        if (counter % 5 === 0) {
            dispatch(setLoadingProgress({ index: series_index, length: counter }))
        }
        counter++;
        let instance_id = instances_list[index_instaces];
        img_data = await getJpeg(instance_id, token);
        loading_data[series_index].push({ ind: parseInt(index_instaces), data: img_data });
        series_data.push({ ind: parseInt(index_instaces), data: img_data });
    }
    dispatch(setLoadingProgress({ index: series_index, length: counter }));
    return series_data;
}


async function getViewerImages(study_id: string, token: string,
    loading_data: imageListItem[][], setSeries_lengths: React.Dispatch<React.SetStateAction<number[]>>,
    functions: stateFunctions
) {
    // get studies -> series -> instances

    let all_frames: Array<viewerData> = [];
    let promise_list = [];
    let series_list = await getSeries(study_id, token);
    let s_lengths = [];
    for (const index_series in series_list) {
        loading_data.push([])
        const series_id = series_list[index_series];
        const instances_list = await getInstances(series_id, token);
        s_lengths.push(instances_list.length);
        promise_list.push(
            getSeriesData(instances_list, token, loading_data,
                parseInt(index_series), functions)
                .then((series_data) => {
                    all_frames.push({ ind: parseInt(index_series), series: series_data })
                })
        );
    }
    setSeries_lengths(s_lengths);

    const rez = await Promise.all(promise_list);
    return all_frames;
}

export {
    getStudies,
    studiesListEntry,
    getViewerImages
};