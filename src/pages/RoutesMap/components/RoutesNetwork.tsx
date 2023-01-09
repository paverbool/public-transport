import React, {useEffect, useLayoutEffect} from "react";
import {CheckedRoute, RouteData} from "../types";
import {GeoJSON, Pane, Polyline} from "react-leaflet";
import {useMutation, useQuery} from "react-query";
import {stopsIsochronesAPI} from "../../../API/stopsSsochronesAPI";
import {getDensityColor} from "../../../utils/colors";
import {PathOptions} from "leaflet";
import {citiesConfig, CitiesKeys} from "../../../contsants/constants";
import {GeoJsonObject} from "geojson";

const heavy_process = new Worker( /* webpackChunkName: "union-worker" */  new URL('./heavy_process', import.meta.url));

type Props = {
    transport: string
    routesData?: RouteData[]
    checked?: CheckedRoute //todo
    isochrones: GeoJsonObject // todo
}


const defaultPathOptions = {
    fillColor: '#2f4858',
    color: '#2f4858',
    fillOpacity: 0.5,
    weight: 3,
    dashArray: '5, 5',
    dashOffset: '5'
}

function getPathOptions(d: number) {
    return {
        ...defaultPathOptions,
        fillColor: getDensityColor(d),
        color: getDensityColor(d),
    }
}

const pathOptions: Record<string, PathOptions> = {
    // 'Метро': getPathOptions(10)
}
export const RoutesNetwork =
    ({routesData, checked, transport, isochrones}: Props) => {
        // const [stopsUnion, setStopsUnion] = React.useState<any>(null);


        // useEffect(() => {
        // heavy_process.addEventListener('message', ({data: {result, transport: _transport}}) => {
        // if (transport === _transport) {
        //     setStopsUnion(result);
        //     // setAreaData((prevData) => ({ todo
        //     //     ...prevData,
        //     //     [_transport]: result
        //     // }))
        // }
        // });
        // }, [routesData]);

        // useEffect(() => {
        // if (!routesData) return;
        // const isochronesData = stopsIsochrones.data;
        // if (!isochronesData) return;
        // const routeData = routesData.filter(r => checked?.children[r.id]);
        // const filteredData = {
        //     ...isochronesData,
        //     features: isochronesData.features.filter((iF: any) => routeData.find(r => r.stops.find(s => s.i === iF.properties.id)))
        // };
        // setStopsUnion(null);

        // @ts-ignore
        // unifiedIsochronesQuery.mutate({data: checked?.children})

        // heavy_process.postMessage({
        //     data: filteredData,
        //     transport
        // });
        // }, [checked?.children])
        console.log(isochrones);

        if (!routesData /*|| !stopsUnion*/ || !isochrones) return null
        return <>
            <GeoJSON
                data={isochrones}
                pathOptions={pathOptions?.[transport] || defaultPathOptions}
            />
            {
                routesData.map(x =>
                    checked?.children[x.id] ?
                        <Polyline key={x.number} pathOptions={x.routePathOptions} positions={x.routePath}/> : null
                )
            }</>
    };

