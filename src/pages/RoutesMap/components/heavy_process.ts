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

