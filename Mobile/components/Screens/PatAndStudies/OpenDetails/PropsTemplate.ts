export type DetailsPropsTemplate = {
    setOpenDetails?,
    setRefreshPatList?,
    setRespUnlim4h?,
    adminList?: 'med' | 'pat',
    type: 'PatsAssigned' | 'AllPats' | 'Study' | 'UnassignedStudies' | 'Requests' | 'My Requests'
}
