import {client} from "./client";
import {RoutesResponse} from "../pages/RoutesMap/types";

const defaultKeys = ['Метро', 'Трамвай', 'Автобус', 'Маршрутка', 'Тролейбус', 'Примыський'];
export const routesAPI = async (city: string, keys: string[] = defaultKeys) => {
    const {data} = await client.post<RoutesResponse>('routes', {
        city,
        keys,
    })
    return data as RoutesResponse
}