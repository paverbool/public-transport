import React, {useEffect, useRef, useState} from "react";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as ttt from '@tomtom-international/web-sdk-maps';
import tt, {IncidentResultV5} from '@tomtom-international/web-sdk-services';

const START_POSITION = {lng: 36.2727449, lat: 49.9927649}
const MAX_ZOOM = 14;

export function IncidentsHeatmap() {
    const mapElement = useRef();
    // const [mapLongitude, setMapLongitude] = useState(START_POSITION.lng);
    // const [mapLatitude, setMapLatitude] = useState(START_POSITION.lat);
    // const [mapZoom, setMapZoom] = useState(12);
    const [map, setMap] = useState({});
    //
    // const increaseZoom = () => {
    //     if (mapZoom < MAX_ZOOM) {
    //         setMapZoom(mapZoom + 1);
    //     }
    // };
    //
    // const decreaseZoom = () => {
    //     if (mapZoom > 1) {
    //         setMapZoom(mapZoom - 1);
    //     }
    // };
    //
    // const updateMap = () => {
    //     // @ts-ignore
    //     map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
    //     // @ts-ignore
    //     map.setZoom(mapZoom);
    // };

    useEffect(() => {
        let map = ttt.map({
            /*
            This key will API key only works on this Stackblitz. To use this code in your own project,
            sign up for an API key on the TomTom Developer Portal.
            */
            key: "MGpvrzgn77nGAEp184I8BUfAdWgD4nwh",
            // @ts-ignore
            container: mapElement.current,
            center: [START_POSITION.lng, START_POSITION.lat],
            zoom: 12,
            stylesVisibility: {
                trafficFlow: true
            },
        });
        map.addControl(new ttt.FullscreenControl());
        map.addControl(new ttt.NavigationControl());
        map.on('load', handleServiceRequest);

        setMap(map);

        function handleServiceRequest() {
            tt.services.incidentDetailsV5({
                key: 'MGpvrzgn77nGAEp184I8BUfAdWgD4nwh',
                boundingBox: map.getBounds()
            })
                .then(function (response) {
                    console.log(response)
                    const points: IncidentResultV5[] = [];
                    response.incidents!.forEach((poi) => {
                        // @ts-ignore //todo
                        points.push(...poi.geometry.coordinates);
                    });
                    map.addLayer(createHeatmapLayer(pointsToGeoJson(points)) as any);
                    map.setZoom(9);
                });
        }

        function pointsToGeoJson(points: IncidentResultV5[]) {
            return {
                type: 'FeatureCollection',
                features: points.map((point) => ({
                    geometry: {
                        type: 'Point',
                        coordinates: point
                    },
                    properties: {}
                }))
            };
        }

        function createHeatmapLayer(geoJson: any) {
            return {
                'id': 'heatmap',
                'type': 'heatmap',
                'source': {
                    'type': 'geojson',
                    'data': geoJson
                }
            };
        }


        return () => map.remove();
    }, []);

    return (
        <div className="App">
            {/*// @ts-ignore*/}
            <div ref={mapElement} className="mapDiv" style={{height: '100vh'}}/>
        </div>
    );
}


