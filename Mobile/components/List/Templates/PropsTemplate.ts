import { ListEntry } from '../../../types/ListEntry';
export type propsTemplate = {
    token: string,
    item: ListEntry,
    req_study_id?: string,
    adminList?: 'med' | 'pat',
    viewStudiesType?: 'unassigned' | 'personal',
    viewPatientsType?: 'assign_study' | 'personal',
    dispatch?,
    setOpenViewer?,
    setOpenAssignment?,
    setViewStudies?,
    setRefreshList?,
    asset?,
    setOpenDetails?,
    navigation
}