import { studiesListEntry } from "../dataRequests/DicomData"

export type ListEntry = {
    study_id?: string,
    modality?: string,
    date?: string,
    previewB64?: string,

    username?: string,
    uid?: string,
    age?: number,
    sex?: 'M' | 'F',
    full_name?: string,
    // username of the doctor to which he's assigned
    doctor_username?: string,
    // profile picture in base64 string
    profile_pic?: string,
}

export type accountDataListEntry = {
    username: string,
    uid: string,
    age: number,
    sex: 'M' | 'F',
    full_name: string,
    // profile picture in base64 string
    profile_pic: string,
    doctor_username?: string,
}

export type requestsListEntry = {
    patient_username: string,
    accepted: 'Y' | 'N',
    full_name: string,
    date: string,
    profile_pic: string,
    uid: string,
}

export type imageListItem = {
    ind: number,
    data: string
}