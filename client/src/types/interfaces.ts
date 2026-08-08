export interface IPatient {
    id: string;
    name: string;
    lastName: string;
    birthDate: string;
    sex: string;
    city: string;
    email: string;
    phone: string;
    address: string;
    job: string;
    doctor: string;
    passif: string;
}

export interface IContact {
    id: string;
    type_bitfield: number,
    //type: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: string;
    city: string;
    email: string;
    phone: string;
    address: string;
    job: string;
    doctor: string;
}

export interface IContactType {
    value: number
    label: string
}
/*
export interface IAppointment {
    appID: string;
    kind: string;
    status: string;
    start: string;
    end: string;
    practitionerName: string;
    practitionerLastName: string;
    payment?: string;
    amount?: string;
    method?: string;
    content: string;
}
*/
export interface ISession {
    id: number;
    type: string;
    mode: string;
    notes: string;

}
export interface IPassif {
    lastAppointments: number[];
    medicalIssues: string;
}

export interface IAnamnesis {
    reasons: string;
    symptoms: string;
    knownDiseases: string;
}

export interface IConclusion {
    diagnosis: string;
    treatment: string;
    observations: string;
}

export interface IAppointmentDataView {
    appID?: string;
    date: string;
    kind: string;
    anamnesis: string;
    conclusion: string;
    patientId: string;
    status: string;
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    sex: string;
    city: string;
    passif: string;
    amount: string;
    method: string;
    pName: string;
    pLastName: string;
    doctor: string;
    job: string;
    phone: string;
    address: string;
}

export interface IAppointmentExtended {
    id: string;
    date: string;
    kind: string;
    content: string;
    patientId: string;
    status: string;
    name: string;
    lastName: string;
    sex: string;
}

export interface IAppointmentDataEdit {
    appID?: string;
    date: string;
    kind: string;
    patientId: string;
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    sex: string;
    city: string;
    passif: string;
    pName: string;
    pLastName: string;
    doctor: string;
    job: string;
    phone: string;
    address: string;
}

export interface IUser {
    id: number;
    login: string;
    role_id: number;
    role: string;
    state_id: number,
    state: string;
    password: string;
    clearPassword: string;
    lastActive: string;
}

export interface IRole {
    value: number;
    label: string;
}

export interface IState {
    value: number;
    label: string;
}

export interface IEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    kind: string;
}
