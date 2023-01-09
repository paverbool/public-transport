import fs from "fs";
import {RawRoutes, RawRouteStop} from "../types/RawRoutes.interface";
import {featureCollection} from "@turf/helpers";
import {IsochronesResponse} from "../types/IsochronesResponse.interface";

export interface FilterIsochronesMapboxParams extends Record<string, number> {
    all: number
}

interface RouteStop extends RawRouteStop {
    transport: string
}


export async function filterIsochronesMapbox(stopsIds: Record<string, number[]>, desiredContour: FilterIsochronesMapboxParams, city: string,) {
    const currentIsochrones: IsochronesResponse = JSON.parse(fs.readFileSync(`./server/store/${city}/isochrones-mapbox0.json`, "utf8"));
    const ROUTES: RawRoutes = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA.json`, "utf8"));
    const stopsById = Object.values(ROUTES)
        .reduce((acc: Record<number, RouteStop>, rr) => {
            const nv: Record<number, RouteStop> = {};
            rr.forEach(r => {
                [...r.route.stops.forward, ...r.route.stops.forward]
                    .forEach(s => {
                        nv[s.i] = {
                            ...s,
                            transport: r.transport
                        }
                    })
            })
            return {...acc, ...nv}
        }, {});

    const features = currentIsochrones.features
        .filter(iso => iso.properties.contour === (desiredContour[stopsById?.[iso?.properties?.id as number]?.transport] || desiredContour['all']));
    return features;
}