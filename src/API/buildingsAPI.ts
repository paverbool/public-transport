import axios from "axios";

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
    const {data} = await axios.get<BuildingsAPIResponse[]>('http://localhost:3004/buildings/0');
    return data
}