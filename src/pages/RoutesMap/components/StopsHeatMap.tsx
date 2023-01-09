import {useLeafletContext} from "@react-leaflet/core";
import {useEffect} from "react";
import * as R from "ramda";
import HeatmapOverlay from "leaflet-heatmap";
import {RouteData} from "../types";


const cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 1 / 100,
    // "maxOpacity": 1,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    // valueField: 'value',
    blur: 1,
};
const heatmapLayer = new HeatmapOverlay(cfg);


type Props = {
    data: {
        transport: string
        routes: RouteData[]
    }[]
};

export function StopsHeatMap({data}: Props) {
    const context = useLeafletContext()

    useEffect(() => {
        const container = context.layerContainer || context.map
        if (data) {
            const _d = R.flatten(Object.values(data)
                .filter((x: any) => x.transport !== 'Приміський')
                .map((x: any) =>
                    R.flatten(
                        x.routes.map((g: any) =>
                            g.stops.map((s: any) => ({

                                    ...s,
                                    value: x.transport === 'Метро' ? 100 : 20,
                                })
                            ))
                    )
                )
            );
            const testData = {
                max: 20,
                min: 0,
                data: _d
            };
            container.addLayer(heatmapLayer)
            heatmapLayer.setData(testData);
        }
        return () => {
            container.removeLayer(heatmapLayer)
        }
    }, [data])

    return null
}
