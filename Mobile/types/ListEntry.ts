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
    doctor_username?: string, 
}

export type patientsListEntry = {
    username: string,
    uid: string,
    age: number,
    sex: 'M' | 'F',
    full_name: string,
    doctor_username: string,
}

export type imageListItem = {
    ind: number,
    data: string
}