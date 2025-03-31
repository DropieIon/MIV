export type requestsApiResp = {
    patient_username?: string,
    doctor_username?: string,
    accepted: 'Y' | 'N',
    full_name: string,
    date: string,
    profile_pic: string,
    nrOfStudies: number,
    sex: 'M' | 'F',
    birthday: string,
}