import {client} from "./client";

export const routesAPI = async () => {
    const {data} = await client.get('routes')
    return data
}