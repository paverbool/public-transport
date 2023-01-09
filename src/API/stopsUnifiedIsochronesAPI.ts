import {client} from "./client";
import {citiesConfig, CitiesKeys} from "../contsants/constants";


interface FilterIsochronesMapboxParams extends Record<string, number> {
    all: number
}

interface Payload {
    city?: string
    desiredContour: FilterIsochronesMapboxParams
}

interface Params {
    city: CitiesKeys
    ids: Record<string, number[]>
}

export const stopsUnifiedIsochronesAPI = async ({city, ids = {}}: Params) => {
    const {data} = await client.post('isochrones/unify', {
        city,
        ids,
        desiredContour: citiesConfig[city].defaultDesiredContour || [],
    })

    return data
}