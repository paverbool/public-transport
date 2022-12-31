import React, {useEffect, useLayoutEffect} from "react";
import {RouteData} from "../types";
import {GeoJSON, Polyline} from "react-leaflet";
import {CheckedRoute} from "../RoutesMap";
import {useQuery} from "react-query";
import {stopsIsochronesAPI} from "../../../API/stopsSsochronesAPI";

const heavy_process = new Worker( /* webpackChunkName: "union-worker" */  new URL('./heavy_process', import.meta.url));

type Props = {
    routesData: RouteData[]
    radius?: number
    reach?: boolean
    checked?: CheckedRoute
    transport: string
}
// const apiKey = '5b3ce3597851110001cf6248538e30f8d1fa4f5792b17c5d05ffb873';

export const RoutesNetwork =
    ({routesData, radius = 600, reach = false, checked, transport}: Props) => {
        const [stopsUnion, setStopsUnion] = React.useState<any>(null);

        const stopsIsochrones = useQuery('isochrones',
            () => stopsIsochronesAPI(),
            {
                onSuccess: data => {
                    // setStopsUnion({
                    //     "type": "FeatureCollection",
                    //     "features": data
                    // })
                    // const container = context.layerContainer || context.map
                    // const cities = new L.LayerGroup();
                    // LGeo.fromGeoJson(data, {
                    //     stroke: false,
                    //     opacity: 0.9,
                    //     fillOpacity: 0.1
                    // })
                    //     .addTo(cities);
                    // const t = unify(cities.getLayers());

                    // const stopsIds = R.uniq(routesData.reduce((acc: number[], x) => [...acc, ...x.stops.map(f => f.i)], []));
                    // const filteredData = {
                    //     ...data,
                    //     // features: data.features.filter((x: any) => stopsIds.some(y => y === x.properties.id))
                    //     features: data.features.filter((x: any) => checked?.children[x.properties.id])
                    // };
                    // setStopsUnion(unify(filteredData));

                    // const t = unify(cities.getLayers()).toGeoJSON();

                    // setStopsUnion(t.setStyle({
                    //     fillColor: routesData[0].color || 'black',
                    //     color: routesData[0].color || 'black',
                    //     fillOpacity: 0.2,
                    //     weight: 2,
                    //     dashArray: '5, 5',
                    //     dashOffset: '5'
                    // }));

                    // container.addLayer(t)
                }
            });
        useLayoutEffect(() => {
            heavy_process.addEventListener('message', ({data: {result, transport: _transport}}) => {
                if (transport === _transport) {
                    setStopsUnion(result);
                }
            });
        }, []);

        useEffect(() => {
            const isochronesData = stopsIsochrones.data;
            if (!isochronesData) return;
            const routeData = routesData.filter(r => checked?.children[r.id]);
            const filteredData = {
                ...isochronesData,
                features: isochronesData.features.filter((iF: any) => routeData.find(r => r.stops.find(s => s.i === iF.properties.id)))
            };
            setStopsUnion(null);
            heavy_process.postMessage({
                data: filteredData,
                transport
            });

        }, [stopsIsochrones.data, checked?.children])

        React.useEffect(() => {
            // if (!reach) return () => {
            // }
            // const container = context.layerContainer || context.map
            // const cities = new L.LayerGroup();
            // if (stopsUnion) container.removeLayer(stopsUnion)

            // const stopsMarkers: [number, number][] = [];
            // routesData.forEach((xsd) => {
            //     if (checked && checked?.children[xsd.id]) {
            //         xsd.stops.forEach(x => {
            //             stopsMarkers.push([x.lng, x.lat]);
            //             // LGeo.circle(x, radius, {
            //             //     stroke: false,
            //             //     opacity: 0.9,
            //             //     fillOpacity: 0.1
            //             // })
            //             //     .addTo(cities);
            //         })
            //     }
            // });
            // if (stopsMarkers.length)
            // queryClient.invalidateQueries({queryKey: ['isochrones']}) //todo

            // const t = unify(cities.getLayers());
            // const t = unify(cities.getLayers()).toGeoJSON();

            // setStopsUnion(t.setStyle({
            //     fillColor: routesData[0].color || 'black',
            //     color: routesData[0].color || 'black',
            //     fillOpacity: 0.2,
            //     weight: 2,
            //     dashArray: '5, 5',
            //     dashOffset: '5'
            // }));

            // container.addLayer(t)
            return () => {
                // container.removeLayer(cities)
            }
        }, [reach, checked]);
        if (!stopsUnion) return null
        return <>
            <GeoJSON
                data={stopsUnion as any}
                pathOptions={{
                    fillColor: '#ссс',
                    color: 'gray',
                    fillOpacity: 0.4,
                    weight: 1,
                    dashArray: '5, 5',
                    dashOffset: '5'
                }}/>
            {
                routesData.map(x =>
                    checked?.children[x.id] ?
                        <Polyline key={x.number} pathOptions={x.routePathOptions} positions={x.routePath}/> : null
                )
            }</>
    };

// function unify(data: FeatureCollection<Polygon>) {
//     if (!data.features?.[0]?.geometry?.coordinates) return
//     const poly1 = polygon(data.features?.[0]?.geometry?.coordinates);
//     const unionTemp = data.features.reduce((acc, x) =>
//         union(
//             acc as Feature<Polygon>,
//             polygon(x.geometry.coordinates)
//         ), union(poly1, poly1)) as any;
//     return unionTemp;
// }
