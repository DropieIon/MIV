import { ListEntry } from '@types/ListEntry';
export type propsTemplate = {
    token: string,
    item: ListEntry,
    dispatch?,
    setOpenViewer?,
    asset?,
    navigation
}