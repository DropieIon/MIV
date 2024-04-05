export type registerForm = {
    username: string,
    email: string,
    password: string,
    isMedic: yayOrNay
}

export type patientForm = {
    age: number,
    sex: 'M' | 'F'
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
    isMedic: yayOrNay
}

export type yayOrNay = "Y" | "N"

export type loginForm = {
    username: string,
    password: string
}