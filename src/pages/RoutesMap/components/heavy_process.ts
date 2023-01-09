import {FeatureCollection, MultiPolygon, Polygon} from "geojson";
import {multiPolygon, polygon} from "@turf/helpers";
import union from "@turf/union";
import {Feature} from "@turf/helpers/dist/js/lib/geojson";

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.onmessage = ({data: {data, transport}}) => {
    function unify(data: FeatureCollection<MultiPolygon>) {
        if (!data.features?.[0]?.geometry?.coordinates) return
        const poly1 = multiPolygon(data.features?.[0]?.geometry?.coordinates);
        const unionTemp = data.features.reduce((acc, x) => {
            let r = acc;
            try {
                r = union(
                    acc as Feature<MultiPolygon>,
                    multiPolygon(x.geometry.coordinates)
                );
            } catch (er) {
                console.log(111111111111111, er)
            }
            return r
        }, union(poly1, poly1)) as any;
        return unionTemp;
    }

    const result = unify(data);
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
        result,
        transport
    });
};

