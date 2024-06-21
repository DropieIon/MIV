import { MyDocsListEntry } from '../../../../Common/types';
import { ListEntry } from '../../../types/ListEntry';
export type propsTemplate = {
    token: string,
    item: ListEntry | MyDocsListEntry,
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