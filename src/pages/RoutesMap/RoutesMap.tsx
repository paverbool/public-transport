import React from 'react';
import {LayersControl, MapContainer} from 'react-leaflet'
import {RoutesNetwork} from "./components/RoutesNetwork";
import type {RawDataItem, RouteData, RouteRawData} from "./types";
import {MetaRawData} from "./types";
import RoutesNav from "./components/RoutesNav";
import {PathOptions} from "leaflet";
import {useQuery} from "react-query";
import {routesAPI} from "../../API/routes";
import {Watermark} from "./components/Watermark";
import {Loading} from "./components/Loading";
import {TileLayers} from "./components/TileLayers";
import {DensityLayers} from "./components/DensityLayers";

function getRouteData(data: RouteRawData) {
    return `${data.points.forward} ${data.points.backward}`.split(' ').map(x => {
        const [lat, lng] = x.split(',');
        return ({
            lat: Number(lat),
            lng: Number(lng)
        });
    });
}

function getStops(data: RouteRawData) {
    return [...data.stops.forward, ...data.stops.backward].map(x => ({
        i: x.i,
        lat: x.x,
        lng: x.y,
    }))
}

function prepareData(rawData: RawDataItem[], options: PathOptions = {color: 'black'}): RouteData[] {
    // const randomColor = getRandomColor();
    return rawData.map((x) => ({
        number: x.id,
        id: x.id,
        meta: x.meta,
        routePath: getRouteData(x.route),
        stops: getStops(x.route),
        color: options.color || 'black',
        routePathOptions: {color: 'black', weight: 0.3, ...options},
    }))
}

const position = {lat: 49.9787334, lng: 36.2564556}

export type CheckedRoute = {
    checked: boolean
    indeterminate: boolean
    children: Record<string, boolean>
};
export type CheckedRoutes = Record<string, CheckedRoute>;

type Keys = 'Автобус' | "Маршрутка" | 'Метро' | 'Приміський' | 'Трамвай' | 'Тролейбус';
const order: Record<Keys, number> = {
    'Метро': 1,
    'Трамвай': 2,
    'Тролейбус': 3,
    'Автобус': 4,
    'Приміський': 5,
    'Маршрутка': 6,
}
export const RoutesMap = () => {
    const rawData = useQuery('routes', routesAPI, {
        refetchOnWindowFocus: false,
        onSuccess: data => {
            setChecked(data!.ROUTES_FOR_MENU
                .reduce((acc: any, v: any) => ({
                    ...acc,
                    [v.transport]: {
                        checked: false,
                        indeterminate: false,
                        children: v.routes
                            .reduce((acc: any, v: any) => ({
                                ...acc,
                                [v.ri]: false
                            }), {})

                    }
                }), {}))
        },
        select: RAW_DATA => ({
            ROUTES_FOR_MENU: Object.entries(RAW_DATA)
                .sort((a, b) => {
                    return (order[a[0] as Keys] || 0) - (order[b[0] as Keys] || 0)
                })
                .map(([k, v]: any) => ({
                    transport: k,
                    routes: v.map((x: any) => x.meta)
                })) as { routes: MetaRawData[]; transport: string }[],
            METRO_DATA: prepareData(RAW_DATA['Метро'], {color: 'green'}),
            TRAM_DATA: prepareData(RAW_DATA['Трамвай'], {color: 'red'}),
            TROL_DATA: prepareData(RAW_DATA['Тролейбус'], {color: 'blue'}),
            BUS_DATA: prepareData(RAW_DATA['Автобус'],),
            MINIBUS_DATA: prepareData(RAW_DATA['Маршрутка']),
            OUTCITYBUS_DATA: prepareData(RAW_DATA['Приміський']),
        })
    });

    const [checked, setChecked] = React.useState<CheckedRoutes>({});

    if (rawData.isLoading) return <Loading/>;

    return <>
        <RoutesNav checked={checked} setChecked={setChecked} routes={rawData.data!.ROUTES_FOR_MENU}/>
        <MapContainer center={position} zoom={13} style={{height: '100vh'}}>

            <LayersControl position="topleft">
                <TileLayers/>
                <DensityLayers/>
            </LayersControl>
            <RoutesNetwork transport={'Метро'} checked={checked['Метро']} routesData={rawData.data!.METRO_DATA}/>
            <RoutesNetwork transport={'Трамвай'} checked={checked['Трамвай']} routesData={rawData.data!.TRAM_DATA}/>
            <RoutesNetwork transport={'Тролейбус'} checked={checked['Тролейбус']} routesData={rawData.data!.TROL_DATA}/>
            <RoutesNetwork transport={'Автобус'} checked={checked['Автобус']} routesData={rawData.data!.BUS_DATA}/>
            <RoutesNetwork transport={'Маршрутка'} checked={checked['Маршрутка']}
                           routesData={rawData.data!.MINIBUS_DATA}/>
            <RoutesNetwork transport={'Приміський автобус'} checked={checked['Приміський автобус']}
                           routesData={rawData.data!.OUTCITYBUS_DATA}/>
            <Watermark/>
        </MapContainer>
    </>
}
