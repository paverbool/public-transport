import {FeatureCollection, Polygon} from "geojson";
import {polygon} from "@turf/helpers";
import union from "@turf/union";
import {Feature} from "@turf/helpers/dist/js/lib/geojson";


// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.onmessage = ({data: {data, transport}}) => {
    function unify(data: FeatureCollection<Polygon>) {
        if (!data.features?.[0]?.geometry?.coordinates) return
        const poly1 = polygon(data.features?.[0]?.geometry?.coordinates);
        const unionTemp = data.features.reduce((acc, x) =>
            union(
                acc as Feature<Polygon>,
                polygon(x.geometry.coordinates)
            ), union(poly1, poly1)) as any;
        return unionTemp;
    }

    const result = unify(data);
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
        result,
        transport
    });
};

// eslint-disable-next-line no-restricted-globals
// self.onmessage = async (message) => {
//
//
//     // const nbr = message.data;
//     // var n1 = 0;
//     // var n2 = 1;
//     // var somme = 0;
//     //
//     //
//     // for (let i = 2; i <= nbr; i++) {
//     //     somme = n1 + n2;
//     //
//     //
//     //     n1 = n2;
//     //
//     //
//     //     n2 = somme;
//     // }
//
//     // const result = nbr ? n2 : n1;
//
//
//     postMessage(result);
// };

