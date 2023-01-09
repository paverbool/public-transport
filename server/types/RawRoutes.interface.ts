export interface RawRouteStop {
    i: number
    n: string
    d: number
    x: number
    y: number
}

export interface RawRoute {
    transport: string
    id: number
    meta: {
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
        s: string
        f: string
    },
    route: {
        points: {
            forward: string
            backward: string
        },
        stops: { backward: RawRouteStop[], forward: RawRouteStop[] },
        begin: { id: number, x: number, y: number },
        end: { id: number, x: number, y: number }
    }
}

export type TransportKeys = 'Метро' | 'Трамвай' | 'Тролейбус' | 'Автобус' | 'Приміський' | 'Маршрутка' | 'Електрички'

export type RawRoutes = Record<TransportKeys, RawRoute[]>
