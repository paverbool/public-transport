import fetch from 'cross-fetch';
import * as R from "ramda";
import DATA from '../ROUTES_DATA.json';
import fs from "fs";
import {TransportRoute} from "../types/TransportRoute.interface";
import {IsochronesResponse} from "../types/IsochronesResponse.interface";
import {featureCollection} from "@turf/helpers";


const TRANSPORT_DATA: TransportRoute[] = DATA['Автобус'];

export async function getIsochrones() {
    const currentIsochrones: IsochronesResponse = JSON.parse(fs.readFileSync("./server/store/isochrones-metro.json", "utf8"));

    const _stops = TRANSPORT_DATA
        .map(x =>
            R.uniqBy(R.pick(['i']), [...x.route.stops.forward, ...x.route.stops.backward])
                .map(c => ({
                    id: x.id,
                    ...c,
                    lngLat: [c.y, c.x]
                })))
        .reduce((acc, v) => [...acc, ...v], []);
    const _filtereDstops = _stops
        .filter(c => currentIsochrones.features.every(x => x.properties.id !== c.i))
        // .slice(0, 100)/* todo */;

    console.log(`
        STOPS
        total: ${_stops.length}
        filtered total: ${_filtereDstops.length}
    `);

    const delay = async (index: number, cb: () => Promise<any>) => {
        return await new Promise(resolve => {
            setTimeout(async () => {
                await resolve(await cb())
            }, index * 13 * 1000)
        })
    }
    const resp = await Promise.all(
        R.splitEvery(5, _filtereDstops)
            .map(async (list, index) => {
                const body = JSON.stringify({
                    locations: list.map(f => f.lngLat),
                    range: [6 * 60],
                    range_type: "time"
                });

                const data: any = await delay(index, async () => {
                    const res = await fetch('https://api.openrouteservice.org/v2/isochrones/foot-walking', {
                        // const res = await fetch('http://localhost:8080/ors/v2/isochrones/foot-walking', {
                        method: 'POST',
                        body,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': '5b3ce3597851110001cf6248538e30f8d1fa4f5792b17c5d05ffb873',
                        }
                    });
                    const _data = await res.json();
                    if (!Array.isArray(_data?.features)) {
                        console.log('Features are not provided')
                        console.log(JSON.stringify(_data, null, 2))
                    }
                    return _data;
                });

                console.log(123123, JSON.stringify(data, null))


                return {
                    ...data,
                    features: (data?.features || [])
                        .map((f: any, i: number) => ({
                            ...f,
                            properties: {
                                ...f.properties,
                                id: list[i]?.i
                            }
                        }))
                }
            })
    );

    const ultimateRes = featureCollection(resp.reduce((acc, d) => [...acc, ...d.features], [...currentIsochrones.features]));
    await fs.writeFileSync(`./server/store/isochrones-metro.json`, JSON.stringify(ultimateRes));
    console.log("File written successfully\n");
}