type Stop = {
    i: number
    n: string
    d: number
    x: number
    y: number
};
type BeginEndPoint = {
    id: number
    x: number
    y: number
};
type Route = {
    points: {
        forward: string
        backward: string
    }
    stops: {
        forward: Stop[]
        backward: Stop[]
    }
    begin: BeginEndPoint,
    end: BeginEndPoint
};

type Meta = {
    ri: number
    rn: string
    rd: string
    rwt: string
    rwd: {
        monday: number
        tuesday: number
        wednesday: number
        thursday: number
        friday: number
        saturday: number
        sunday: number
    }
    rwi: string
    cn: string
    rp: number
    cur: string
    ti: string
    tk: string
    tn: string
    sp: string
    ga: string
    dis: number
    bold: number
    st: number
    htt?: number
    s: string
    f: string
    icon?: number
};

export interface TransportRoute {
    transport: string
    id: number
    meta: Meta
    route: Route
}