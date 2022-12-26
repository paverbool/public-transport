export type Feature = {
    type: string
    properties: {
        group_index: number
        value: number
        center: number[]
        id?: number | string
    }
    geometry: {
        coordinates: number[][][],
        type: string
    }
};

type Metadata = {
    attribution: string
    service: string
    timestamp: number
    query: {
        profile: string
        locations: {}
        range: {}
        range_type: string
    }
    engine: {
        version: string
        build_date: string
        graph_date: string
    }
};

export interface IsochronesResponse {
    type: string
    bbox: number[]
    features: Feature[]
    metadata: Metadata
}