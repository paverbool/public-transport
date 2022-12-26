import {LayersControl, TileLayer} from "react-leaflet";
import React from "react";

export const TileLayers = () => <>
    <LayersControl.BaseLayer name={'Open Street Map'} checked>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
            // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    </LayersControl.BaseLayer>
    <LayersControl.BaseLayer name={'Light'}>
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
</>
