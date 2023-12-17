export type registerForm = {
    username: string,
    email: string,
    password: string,
    isMedic: yayOrNay
}

export type resp_auth_services = {
    ok: boolean,
    data: string
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