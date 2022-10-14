import React from "react";
import {useLeafletContext} from "@react-leaflet/core";
import L from "leaflet";
import LGeo from "leaflet-geodesy";
import union from "@turf/union";
import {RouteData} from "../types";
import {Polyline, GeoJSON, LayerGroup} from "react-leaflet";
import {CheckedRoute} from "../RoutesMap";

type Props = {
    routesData: RouteData[]
    radius?: number
    reach?: boolean
    checked?: CheckedRoute
}

export const RoutesNetwork = ({routesData, radius = 600, reach = false, checked}: Props) => {
    const context = useLeafletContext()
    const [cityUnion, setCityUnion] = React.useState<any>(null)
    React.useEffect(() => {
        // if (!reach) return () => {
        // }
        const container = context.layerContainer || context.map
        const cities = new L.LayerGroup();
        if (cityUnion) container.removeLayer(cityUnion)

        routesData.forEach((xsd) => {
            if (checked && checked?.children[xsd.id]) {
                xsd.stops.forEach(x => {
                    LGeo.circle(x, radius, {
                        stroke: false,
                        opacity: 0.9,
                        fillOpacity: 0.1
                    })
                        .addTo(cities);
                })
            }
        });

        
        const t = unify(cities.getLayers());
        setCityUnion(t.setStyle({
            fillColor: routesData[0].color || 'black',
            color: routesData[0].color || 'black',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '5, 5',
            dashOffset: '5'
        }));

        container.addLayer(t)
        return () => {
            // container.removeLayer(cities)
        }
    }, [reach, checked])

    return <>{
            routesData.map(x =>
                checked?.children[x.id] ?
                    <Polyline key={x.number} pathOptions={x.routePathOptions} positions={x.routePath}/> : null
            )
        }</>
}

function unify(polyList: any) {
    for (var i = 0; i < polyList.length; ++i) {
        if (i == 0) {
            var unionTemp = polyList[i].toGeoJSON();
        } else {
            unionTemp = union(unionTemp, polyList[i].toGeoJSON());
        }
    }
    return L.geoJson(unionTemp);
}