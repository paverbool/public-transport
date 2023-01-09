import {GeoJSON, LayerGroup, LayersControl} from "react-leaflet";
import densitySub from "../data/Дачи.json";
import {getDensityColor} from "../../../utils/colors";
import densityPrivateProp from "../data/Частный+сектор.json";
import density2_3 from "../data/2-3+этажа.json";
import densityCenter from "../data/Центр.json";
import density20_30_50_x from "../data/--_20-30-50.json";
import density5__60_70_x from "../data/5+эт+60-70+х+годов.json";
import density5_9_12 from "../data/5-9-12.json";
import density9_16 from "../data/9-16+эт.json";
import React from "react";
import * as geojson from "geojson";
import {Layer} from "leaflet";


const onEachFeature = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: Layer) => {
    layer.bindTooltip(feature.properties.name)
};

function getPathOptions(d: number) {
    return {
        color: getDensityColor(d),
        fillOpacity: 0.7,
        stroke: false
    };
}

const rows = [
    {
        name: "Сади",
        data: densitySub,
        pathOptions: getPathOptions(2)
    },

    {
        name: "Приватний сектор",
        data: densityPrivateProp,
        pathOptions: getPathOptions(4)
    },

    {
        name: "2-3 поверхи",
        data: density2_3,
        pathOptions: getPathOptions(5)
    },

    {
        name: "Центр",
        data: densityCenter,
        pathOptions: getPathOptions(7)
    },

    {
        name: "20-30-50-х р.",
        data: density20_30_50_x,
        pathOptions: getPathOptions(8)
    },

    {
        name: "5 поверхів 60-70-х р.",
        data: density5__60_70_x,
        pathOptions: getPathOptions(9)
    },

    {
        name: "5-9-12 поверхів",
        data: density5_9_12,
        pathOptions: getPathOptions(10)
    },

    {
        name: "9-16 поверхів",
        data: density9_16,
        pathOptions: getPathOptions(13.3)
    },
]

export const DensityLayers = () => <>
    {
        rows.map(({name, ...props}) => <LayersControl.Overlay key={name} name={name} >
            <GeoJSON
                {...props as any}
                onEachFeature={onEachFeature}/>
        </LayersControl.Overlay>)
    }
</>