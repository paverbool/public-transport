import {client} from "./client";
import {citiesConfig, CitiesKeys} from "../contsants/constants";


interface FilterIsochronesMapboxParams extends Record<string, number> {
    all: number
}

interface Payload {
    city?: string
    desiredContour: FilterIsochronesMapboxParams
}

export const stopsIsochronesAPI = async (city: CitiesKeys) => {

    const {data} = await client.post('isochones', {
        city,
        desiredContour: citiesConfig[city].defaultDesiredContour,
    })

    return data
}