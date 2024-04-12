export type registerForm = {
    username: string,
    email: string,
    password: string
}

export type patientForm = {
    fullName: string,
    age: number,
    sex: 'M' | 'F',
    profile_picB64: string
}


export type resp_common_services = {
    ok: boolean,
    data: string
}

export type resp_login_service = {
    ok: boolean,
    data: {
        token: string,
        fullName: string
    }
}

export type resp_list_services = {
    ok: boolean,
    data: string[] | string
}

export type jwt_payload = {
    username: string,
    isMedic: yayOrNay,
    canUpload: boolean,
    unlimitedUpToday: boolean
}

export type yayOrNay = "Y" | "N"

export type loginForm = {
    username: string,
    password: string
}