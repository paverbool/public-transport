import {useLeafletContext} from "@react-leaflet/core";
import L from "leaflet";
import React, {useEffect} from "react";
import logo from '../../../assets/default-monochrome-black.svg'

interface Props {

}

// @ts-ignore
L.Control.Watermark = L.Control.extend({
    onAdd: function (map: any) {
        const img = L.DomUtil.create('img');
        img.src = logo;
        img.style.width = '100px';
        img.onclick = () => {
            window.open('https://t.me/kharkiv_for_people', '_blank');
        };
        return img;
    },

    onRemove: function (map: any) {
        // Nothing to do here
    }
});

// @ts-ignore
L.control.watermark = function (opts) {
    // @ts-ignore
    return new L.Control.Watermark(opts);
}
// @ts-ignore
const square = L.control.watermark({position: 'bottomleft'});

export const Watermark = React.memo(() => {
    const context = useLeafletContext()

    useEffect(() => {
        const container = context.layerContainer || context.map
        container.removeLayer(square)
        square.addTo(container);
        return () => {
            container.removeLayer(square)
        }
    }, [])

    return null
}, () => true);