import DATA_buildings from "../store/buildings_large.json";
import fs from "fs";

export const buildingsToGeoJSON = () => {
    const features = DATA_buildings.map((x) => {
        return {
            "type": "Feature",
            "properties": {
                title: x.mname,
                name: x.vid,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    +x.lng,
                    +x.lat
                ]
            }
        }
    });
    const buildings = {
        "type": "FeatureCollection",
        features
    };

    fs.writeFile("./server/store/buildingsGeoJson.json", JSON.stringify(buildings, null, 2), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
        }
    });
}
