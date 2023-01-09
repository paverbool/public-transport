import fetch from 'cross-fetch';
import * as R from "ramda";
import fs from "fs";
import {TransportRoute} from "../types/TransportRoute.interface";
import {IsochronesResponse} from "../types/IsochronesResponse.interface";
import {featureCollection} from "@turf/helpers";
import {RawRoute, RawRoutes, RawRouteStop} from "../types/RawRoutes.interface";

const mapboxToken = 'pk.eyJ1IjoicGF2ZXJib29sIiwiYSI6ImNrb2oxNDRhbjBwdDgycGp6YmFkczIwZzYifQ.WD3KuDeQxeOcVLzIlds_9w';

export async function getIsochronesMapbox(TRANSPORT_DATA: TransportRoute[], contours: number[], city: string, transportType: string) {
    const file = `./server/store/${city}/isochrones-mapbox0.json`;
    const currentIsochrones: IsochronesResponse = JSON.parse(fs.readFileSync(file, "utf8"));
    if(!Array.isArray(TRANSPORT_DATA)) {
        throw new Error(`Data didn\'t provide for ${transportType}`)
    }

    let _stops: any = []
    try {
        _stops = TRANSPORT_DATA
            .map(x =>
                R.uniqBy(R.pick(['i']), [...(x.route.stops?.forward || []), ...(x.route.stops?.backward || [])])
                    .map(c => ({
                        id: x.id,
                        ...c,
                        lngLat: [c.y, c.x]
                    })))
            .reduce((acc, v) => [...acc, ...v], []);
    } catch (e) {
        console.log(e,)
    }
    const smallIsochrones = currentIsochrones.features.filter(x => x.properties.contour === 6)
        .map(({properties: {id, contour}}) => id)

    const _filtereDstops = _stops
        .filter((c: any) =>
                //     !smallIsochrones.includes(c.i)
                currentIsochrones.features.every(x => x.properties?.id !== c.i)
            //     // currentIsochrones.features.some(x => (x.properties.id === c.i && x.properties?.contour !== contour))
        )

    console.log(`
        STOPS
        total: ${_stops.length}
        filtered total: ${_filtereDstops.length}
    `);

    const delay = async (index: number, cb: () => Promise<any>) => {
        return await new Promise(resolve => {
            setTimeout(async () => {
                await resolve(await cb())
            }, index * 100)
        })
    };

    const resp = await Promise.all(
        _filtereDstops
            .slice(0, 100) // todo
            .map(async (f: any, index: number) => {
                const data: any = await delay(index, async () => {
                    // https://api.mapbox.com/isochrone/v1/mapbox/walking/-73.990593%2C40.740121?contours_minutes=10&polygons=true&denoise=1&access_token=pk.eyJ1IjoicGF2ZXJib29sIiwiYSI6ImNrb2oxNDRhbjBwdDgycGp6YmFkczIwZzYifQ.WD3KuDeQxeOcVLzIlds_9w
                    const coordinates = `${f.lngLat[0]},${f.lngLat[1]}`;
                    const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/${coordinates}?contours_minutes=${contours.join(',')}&polygons=true&denoise=1&access_token=${mapboxToken}`;
                    console.log('Starting...', coordinates)
                    const res = await fetch(url, {
                        method: 'GET',
                    });
                    const _data = await res.json();
                    if (!Array.isArray(_data?.features)) {
                        console.log('Features are not provided')
                        console.log(JSON.stringify(_data, null, 2))
                    }
                    return _data;
                });


                // console.log('DATA: ', JSON.stringify(data, null))

                return {
                    ...data,
                    features: (data?.features || [])
                        .map((_f: any, i: number) => ({
                            ..._f,
                            properties: {
                                ..._f.properties,
                                id: f?.i,
                                contours
                            }
                        }))
                }
            })
    );

    const ultimateRes = featureCollection(resp.reduce((acc, d) => [...acc, ...d.features], [...currentIsochrones.features]));
    await fs.writeFileSync(file, JSON.stringify(ultimateRes));
    console.log("File written successfully\n");
}

