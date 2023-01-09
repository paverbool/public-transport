import {FeatureCollection, MultiPolygon} from "geojson";
import {featureCollection, multiPolygon} from "@turf/helpers";
import union from "@turf/union";
import {Feature} from "@turf/helpers/dist/js/lib/geojson";
import {filterIsochronesMapbox, FilterIsochronesMapboxParams} from "../utils/filterIsochrones";
import {IsochronesResponse} from "../types/IsochronesResponse.interface";
import fs from "fs";
import {RawRoutes, TransportKeys} from "../types/RawRoutes.interface";
import * as  R from "ramda";

export const isochronesUnify =  (stopsIds: Record<string, number[]>, city: string, desiredContour: FilterIsochronesMapboxParams) => {
    const ISOCHRONES: IsochronesResponse = JSON.parse(fs.readFileSync(`./server/store/${city}/isochrones-mapbox0.json`, "utf8"));
    const ROUTES: RawRoutes = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA.json`, "utf8"));

    const re = Object.fromEntries(Object.entries(stopsIds)
        .map(([trKey, idsList]) => {
            const _desiredContour = desiredContour[trKey] || desiredContour['all']

            const features = idsList
                .map(routeId => {
                    const {forward = [], backward = []} = ROUTES[trKey as TransportKeys]
                        .find(rr => rr.id === routeId)?.route?.stops || {};
                    return [...forward, ...backward]
                        .map(stop => ISOCHRONES.features.find(x => stop.i === x.properties.id) || []) //todo empty array?
                })
            console.log('features', features)

            // const features = idsList.map(id => d.find(j => j.properties.id === id)) as any[]
            // console.log('features', features);
            // unify(featureCollection(d))
            const featureCollection1 = featureCollection(R.flatten(features) as any);
            console.log('featureCollection1', featureCollection1)
            const unified = unify(featureCollection1 as any);
            console.log('unified', unified)

            return [trKey, unified]
        }));

    console.log('stopsIds', re);

    // const d = await filterIsochronesMapbox(stopsIds, desiredContour, city)
    //
    // // if (!routesData) return;
    // // const isochronesData = stopsIsochrones.data;
    // // if (!isochronesData) return;
    // // const routeData = routesData.filter(r => checked?.children[r.id]);
    // // const filteredData = {
    // //     ...isochronesData,
    // //     features: isochronesData.features.filter((iF: any) => routeData.find(r => r.stops.find(s => s.i === iF.properties.id)))
    // // };
    //
    // const re = Object.fromEntries(Object.entries(stopsIds)
    //     .map(([trKey, idsList]) => {
    //         // const features = idsList.map(id => d.find(j => j.properties.id === id)) as any[]
    //         // console.log('features', features);
    //         // unify(featureCollection(d))
    //         return [trKey, unify(featureCollection(d[trKey as ]))]
    //     }));
    return re
}

function unify(data: FeatureCollection<MultiPolygon>) {
    if (!data.features?.[0]?.geometry?.coordinates) return
    const poly1 = multiPolygon(data.features?.[0]?.geometry?.coordinates);
    const unionTemp = data.features.reduce((acc, x) => {
        let r = acc;
        try {
            r = union(
                acc as Feature<MultiPolygon>,
                multiPolygon(x.geometry.coordinates)
            );
        } catch (er) {
            console.log(111111111111111, er)
        }
        return r
    }, union(poly1, poly1)) as any;
    return unionTemp;
}

