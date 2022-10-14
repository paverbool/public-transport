export type Stop = {
    i: number
    n: string
    d: number
    x: number
    y: number
};

export interface RouteRawData {
    points: {
        forward: string
        backward: string
    },
    stops: {
        backward: Stop[]
        forward: Stop[]
    },
    begin: {
        id: number
        x: number
        y: number
    }
    end: {
        id: number
        x: number
        y: number
    }
}

export type RouteData = {
    number: number;
    id: number;
    color: string
    routePathOptions: { color: string };
    routePath: { lng: number; lat: number }[];
    stops: { lng: number; i: number; lat: number }[]
    meta: MetaRawData
};

export interface MetaRawData {
    ri: number
    rn: string
    rd: string
    rwt: string | null
    rwd: {
        monday: number
        tuesday: number
        wednesday: number
        thursday: number
        friday: number
        saturday: number
        sunday: number
    },
    rwi: string | null
    cn: string
    rp: number
    cur: 'UAH' | string
    ti: string
    tk: 'tram' | string
    tn: string
    sp: string
    ga: string
    dis: number
    bold: number
    st: number
    s: string
    f: string
}

export interface RawDataItem {
    transport: string
    id: number
    meta: MetaRawData
    route: RouteRawData
}

export type RawData = Record<string, Array<RawDataItem>>