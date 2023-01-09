import {getIsochronesMapbox} from "./getIsochronesMapbox";
import {IsochronesResponse} from "../types/IsochronesResponse.interface";
import fs from "fs";
import {featureCollection} from "@turf/helpers";


// Uncomment to update isochrones
// ["Трамвай", "Швидкісний трамвай", "Автобус", "Метро", "Електричка", "Маршрутка", "Приміський", "Потяги", "Електрички"]
const r = [
    // {n: 'Метро', r: [5, 6, 10]},
    // {n: 'Трамвай', r: [6]},
    // {n: 'Тролейбус', r: 6},
    // {n: 'Автобус', r: 6},
    // {n: 'Маршрутка', r: 6},
    // {n: 'Швидкісний трамвай', r: 6},
    // {n: 'Приміський', r: 6},
    // {n: 'Електрички', r: 6},
    // {n: 'Потяги', r: 6},

        // "Tram",
        // "Subway",
        "Bus",
        // "Railway train"
]/*.map(async x => {
    // @ts-ignore
    return await getIsochronesMapbox(DATA[x.n], [5,6,10]);
}))*/

let city = 'warsaw';
// const DATA: any = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA.json`, "utf8"));
const DATA: any = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA_Bus.json`, "utf8"));
async function get(city: string) {
    await getIsochronesMapbox(DATA[r[0]], [5, 6, 10], city, r[0]);
    // await getIsochronesMapbox(DATA[r[1]], [5, 6, 10], city, r[1]);
    // await getIsochronesMapbox(DATA[r[2]], [5, 6, 10], city, r[2]);
    // await getIsochronesMapbox(DATA[r[3]], [5, 6, 10], city, r[3]);
    // await getIsochronesMapbox(DATA[r[4]], [5, 6, 10], city, r[4]);
    // await getIsochronesMapbox(DATA[r[5]], [5, 6, 10], city, r[5]);
    // await getIsochronesMapbox(DATA[r[6]], [5, 6, 10], city, r[5]);
    // await getIsochronesMapbox(DATA[r[7]], [5, 6, 10], city);
    // await getIsochronesMapbox(DATA[r[8]], [5, 6, 10], city);
}


async function rec(attempts: number) {
    if (attempts <= 0) return
    console.log('attempts: ', attempts);
    await get(city);
    await rec(--attempts)
}

rec(50);

