import React from "react";
import {useLeafletContext} from "@react-leaflet/core";
import L from "leaflet";
import {useQuery} from "react-query";

import {buildingsAPI} from "../../../API/buildingsAPI";


type Props = {}
export const RoutesBuildings = () => {
    // const context = useLeafletContext();

    React.useEffect(() => {
        // const container = context.layerContainer || context.map

        // const r =  context.layersControl.reachability({
        //     // add settings/options here
        //     apiKey: '5b3ce3597851110001cf6248538e30f8d1fa4f5792b17c5d05ffb873'
        // });
    }, [])
    // const buildingsData = useQuery('buildings', buildingsAPI, {
    //     enabled: false,
    //
    //
    //     onSuccess: (data) => {
    //         const container = context.layerContainer || context.map
    //
    //         const buildings = new L.LayerGroup();
    //         data.forEach((x) => {
    //             L.marker({
    //                 lng: +x.lng,
    //                 lat: +x.lat,
    //             })
    //                 .addTo(buildings);
    //
    //         });
    //
    //
    //         // container.addLayer(buildings);
    //
    //         // const s = () => {
    //         //     app.bbox = context.map.getBounds().toBBoxString().split(',').map(n => Number(n));
    //         // };
    //         // context.map.whenReady(s);
    //         // context.map.on('moveend', s);
    //
    //     }
    // });

    React.useEffect(() => {

    }, []);

    return null

};


