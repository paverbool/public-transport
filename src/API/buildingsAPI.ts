import {client} from "./client";

interface BuildingsAPIResponse {
    vid: string
    lat: string
    lng: string
    num: string
    state: string
    pcnt: string
    mname: string
}

export const buildingsAPI = async () => {
    const {data} = await client.get<BuildingsAPIResponse[]>('buildings/0');
    return data
}