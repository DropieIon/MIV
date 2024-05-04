import { ListEntry } from '../../../types/ListEntry';
export type propsTemplate = {
    token: string,
    item: ListEntry,
    dispatch?,
    setOpenViewer?,
    setViewStudies?,
    setRefreshList?,
    asset?,
    setOpenDetails?,
    navigation
}