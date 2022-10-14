import React from 'react';
import {GeoJSON, LayerGroup, LayersControl, MapContainer, TileLayer} from 'react-leaflet'
import RAW_DATA from './ROUTES_DATA.json'
import {RoutesNetwork} from "./components/RoutesNetwork";
import type {RawDataItem, RouteData, RouteRawData} from "./types";
import RoutesNav from "./components/RoutesNav";
import {MetaRawData} from "./types";
import {CRS, Layer, PathOptions, StyleFunction} from "leaflet";

import density20_30_50_x from './data/--_20-30-50.json'
import densitySub from './data/Дачи.json'
import densityPrivateProp from './data/Частный+сектор.json'
import density2_3 from './data/2-3+этажа.json'
import density5__60_70_x from './data/5+эт+60-70+х+годов.json'
import densityCenter from './data/Центр.json'
import density5_9_12 from './data/5-9-12.json'
import density9_16 from './data/9-16+эт.json'
import * as geojson from "geojson";


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
        routePathOptions: {color: 'black', weight: 1, ...options},
    }))
}

const TRAM_DATA = prepareData(RAW_DATA['Трамвай'], {color: 'red'})
const BUS_DATA = prepareData(RAW_DATA['Автобус'],)
const TROL_DATA = prepareData(RAW_DATA['Тролейбус'], {color: 'blue'})
const METRO_DATA = prepareData(RAW_DATA['Метро'], {color: 'green'})
const MINIBUS_DATA = prepareData(RAW_DATA['Маршрутка'])
const OUTCITYBUS_DATA = prepareData(RAW_DATA['Приміський'])

const ROUTES_FOR_MENU: { routes: MetaRawData[]; transport: string }[] =
    Object.entries(RAW_DATA).map(([k, v]) => {
        return {
            transport: k,
            routes: v.map(x => x.meta)
        }
    });

const d = TRAM_DATA.reduce((sumP, c) => {
    return sumP + c.routePath.reduce((sum, current, i, list) => {
        const next = list[i + 1]
        if (!next) return sum
        return sum + CRS.Earth.distance(current, next)
    }, 0);
}, 0)


// const t = CRS.Earth.distance(routesData[0].routePath[0], routesDatCRS.Earth.distance(prev, current)a[0].routePath[2])
console.log(d);


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const position = {lat: 49.9787334, lng: 36.2564556}


export type CheckedRoute = {
    checked: boolean
    indeterminate: boolean
    children: Record<string, boolean>
};
export type CheckedRoutes = Record<string, CheckedRoute>;

function getPathOptions(color: string) {
    return {
        color,
        fillOpacity: 0.7,
        stroke: false
    };
}

const onEachFeature = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: Layer) => {
    layer.bindTooltip(feature.properties.name)
};

export const RoutesMap = () => {
    const [checked, setChecked] = React.useState<CheckedRoutes>(ROUTES_FOR_MENU.reduce((acc, v) => ({
        ...acc,
        [v.transport]: {
            checked: false,
            indeterminate: false,
            children: v.routes
                .reduce((acc, v) => ({
                    ...acc,
                    [v.ri]: false
                }), {})

        }
    }), {}));


    return <>
        <RoutesNav checked={checked} setChecked={setChecked} routes={ROUTES_FOR_MENU}/>
        <MapContainer center={position} zoom={13} style={{height: '100vh'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <GeoJSON data={densitySub as any} pathOptions={getPathOptions('#00e7cc')} onEachFeature={onEachFeature}/>
            <GeoJSON data={densityPrivateProp as any} pathOptions={getPathOptions('#00e77f')} onEachFeature={onEachFeature}/>
            <GeoJSON data={density2_3 as any} pathOptions={getPathOptions('#00bde7')} onEachFeature={onEachFeature}/>
            <GeoJSON data={densityCenter as any} pathOptions={getPathOptions('#1f00e7')} onEachFeature={onEachFeature}/>
            <GeoJSON data={density20_30_50_x as any} pathOptions={getPathOptions('#fd680c')} onEachFeature={onEachFeature}/>
            <GeoJSON data={density5__60_70_x as any} pathOptions={getPathOptions('#c800e7')} onEachFeature={onEachFeature}/>
            <GeoJSON data={density5_9_12 as any} pathOptions={getPathOptions('#e70083')} onEachFeature={onEachFeature}/>
            <GeoJSON data={density9_16 as any} pathOptions={getPathOptions('#e70000')} onEachFeature={onEachFeature}/>

            <RoutesNetwork radius={1000} checked={checked['Метро']} routesData={METRO_DATA} reach={true}/>
            <RoutesNetwork routesData={TRAM_DATA} checked={checked['Трамвай']}/>
            <RoutesNetwork routesData={TROL_DATA} checked={checked['Тролейбус']}/>
            <RoutesNetwork routesData={BUS_DATA} checked={checked['Автобус']}/>
            <RoutesNetwork routesData={MINIBUS_DATA} checked={checked['Маршрутка']}/>
            <RoutesNetwork routesData={OUTCITYBUS_DATA} checked={checked['Приміський автобус']}/>
        </MapContainer>
    </>
}
