import {LayerGroup, LayersControl, TileLayer} from "react-leaflet";
import React from "react";
import {mapboxToken} from "../../../contsants/constants";

export const TileLayers = () => <>
    <LayersControl.BaseLayer name={'Open Street Map'}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name={'Light'} checked>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name={'Dark'}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name={'Terrain'}>
        <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/copyright">mapbox</a> contributors'
            url={`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}{r}.jpg90?access_token=${mapboxToken}`}
        />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name={'Нічого'}>
        <LayerGroup/>
    </LayersControl.BaseLayer>
</>
