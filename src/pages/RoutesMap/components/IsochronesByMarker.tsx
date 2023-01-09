import React, {useState} from "react";
import {Circle, GeoJSON, LayerGroup, Marker, Pane, Popup, useMapEvents} from "react-leaflet";
import * as turf from "@turf/helpers";
import {featureCollection} from "@turf/helpers";
import {CheckedRoutes, RouteData, RouteDataStop} from "../types";
import * as R from "ramda";
import * as L from "leaflet";
import pointsWithinPolygon from "@turf/points-within-polygon";
import axios from "axios";
import {useMutation} from "react-query";
import DirectionsBusIcon from '../../../assets/icons8-bus-50.png';
import PersonIcon from '../../../assets/icons8-elderly-person-50.png';
import {mapboxToken} from "../../../contsants/constants";


interface Props {
    enabled: boolean
    routes: {
        transport: string
        routes: RouteData[]
    }[]
    checked: CheckedRoutes
    setChecked: (checked: CheckedRoutes) => void
    setAreaData: (data: any) => void
}

interface StopWithRouteId extends RouteDataStop {
    routeId: number
}

const i = L.icon({
    iconUrl: PersonIcon,
    iconSize: [25, 25],
})

export function IsochronesByMarker({enabled, routes, setChecked, checked, setAreaData}: Props) {
    const [position, setPosition] = useState(null);
    const [area, setArea] = useState(null);
    const [markers, setMarkers] = useState<any>(null);

    const iso = useMutation<any, any, { lng: number, lat: number }>({
        mutationKey: 'iso',
        mutationFn: async (variables) => {
            const url = `https://api.mapbox.com/isochrone/v1/mapbox/walking/${variables.lng},${variables.lat}?contours_minutes=${[5, 6, 8, 10].join(',')}&polygons=true&denoise=1&access_token=${mapboxToken}`;
            const {data} = await axios.get(url)
            return data
        },
        onSuccess: data => {
            const investigatedArea = data.features.find((x: any) => x?.properties?.contour === 10);
            setArea(investigatedArea);
            const newChecked: CheckedRoutes = {}
            let markers: any[];
            markers = [];
            routes.forEach(route => {
                const points = R.uniqBy(R.prop('i'), route.routes.reduce((acc: StopWithRouteId[], r) => {
                    const stops = r.stops.map(x => ({...x, routeId: r.id}));
                    return [...acc, ...stops];
                }, []))
                    .map(x => turf.point([x.lng, x.lat], {id: x.routeId}));
                const pointsFeatureCollection = featureCollection(points)
                const ptsWithin = pointsWithinPolygon(pointsFeatureCollection, investigatedArea);
                markers = [...markers, ...ptsWithin.features]
                const childrenChecked = ptsWithin.features.reduce((acc, c) => ({
                    ...acc,
                    [c.properties.id]: true
                }), {});
                const newChildrenCheckedLength = Object.values(childrenChecked).length;
                const rootIndeterminate = newChildrenCheckedLength > 0 && newChildrenCheckedLength < route.routes.length
                newChecked[route.transport] = {
                    checked: newChildrenCheckedLength > 0,
                    indeterminate: rootIndeterminate,
                    children: childrenChecked
                }
            });
            setMarkers(featureCollection(markers as any))
            const oldChecked = Object.fromEntries(Object.entries(checked).map(([k, v]) => {
                return [k, {
                    checked: false,
                    indeterminate: false,
                    children: Object.fromEntries(Object.entries(v.children).map(([kk, vv]) => ([kk, false])))
                }]
            }));
            setChecked(R.mergeDeepRight(oldChecked, newChecked));
        }
    });
    const map = useMapEvents({
        click: async (ev) => {
            if (ev.latlng && enabled) {
                // @ts-ignore //todo
                setPosition(ev.latlng);
                setAreaData({});
                await iso.mutateAsync({
                    lng: ev.latlng.lng,
                    lat: ev.latlng.lat
                });

            }
        },
    });

    return position === null || !enabled ? null : (<>
            <Pane name={'iso-location'} style={{zIndex: 500}}>
                {iso.isSuccess &&
                    <GeoJSON
                        pathOptions={{fillColor: '#2a9d8f', color: '#2a9d8f', fillOpacity: 0.66, weight: 2}}
                        data={area as any}/>}
                <Marker position={position} icon={i}>
                    <Popup>You are here</Popup>
                </Marker>
            </Pane>
            <Pane name={'iso-location2'} style={{zIndex: 510}}>
                {iso.isSuccess && <GeoJSON
                    data={markers as any}
                    pointToLayer={(m, latlng) =>
                        L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: DirectionsBusIcon,
                                iconSize: [9, 9],
                            })
                        })}
                />}
            </Pane>
        </>
    )
}
