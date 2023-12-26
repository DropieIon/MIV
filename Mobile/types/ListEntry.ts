import { studiesListEntry } from "../dataRequests/OrthancData"

export type ListEntryStudy = {
    study_id: string,
    modality?: string,
    date?: string,
    previewB64?: string,
    assignee?: string, 
    age?: number,
    sex?: 'M' | 'F'
}

export type imageListItem = {
    ind: number,
    data: string
}