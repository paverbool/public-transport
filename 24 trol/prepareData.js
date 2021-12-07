// import data from './store/26.11.2021-morning.json'
import data from './store/26.11.2021-usual.json'
import {writeIfFileExists} from "./utils.js";
import * as R from "ramda";


const aMetro = [50.0019, 36.30454]
const b602 = [49.99235, 36.35951]
const getStartCoordinates = (revert) => revert ? aMetro : b602
const getFinishCoordinates = (revert) => revert ? b602 : aMetro

{
    let value = data.map((x) => {
        const date = new Date(x.timestamp * 1000);
        const hours = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const seconds = `${date.getSeconds()}`.padEnd(2, '0');

        return ({
            ...x,
            date,
            time: `${hours}:${minutes}:${seconds}`
        });
    })
        .filter(x => x.time > '16:01:00'); // TODO



    function logNumbers (v) {
        console.log(v[0].positions.map(f => f.bort_number))
    }

    logNumbers(value)


    function calc ({bort_number, revert}) {
        let filteredData = value.map(x => {
            const find = x.positions.find(x => x.bort_number === bort_number);
            return {
                date: x.date,
                timestamp: x.timestamp,
                time: x.time,
                lat: find?.lat,
                lng: find?.lng,
                speed: find?.speed
            };
        })

        // const en = filteredData.findIndex(x => (calcCrow(x.lat, x.lng, getFinishCoordinates(revert)[0], getFinishCoordinates(revert)[1]).toFixed(10) * 1000) <= 50) + 1;
        const [st, en] = findStartFinishIndexesRecursively(filteredData, revert);
        const tr_way = filteredData
            .slice(st, en)
            .map((x, i) => ({...x, title: i}));

        return R.uniqBy(
            R.prop('time'),
            tr_way.reduce((acc, it, index) => {
                if (index === 0) {
                    return [{
                        ...it,
                        interval: 0,
                        dist: 0,
                        diff: 0
                    }]
                }
                const prev = acc[acc.length - 1];
                let diff = 0
                if (prev) diff = it.timestamp - prev.timestamp;

                const interval = calcCrow(prev.lat, prev.lng, it.lat, it.lng).toFixed(10) * 1000;
                return [...acc, {
                    ...it,
                    interval: interval,
                    dist: prev.dist + interval,
                    invalid: diff === 0 || (interval / diff * 60 * 60 / 1000) >= 60,
                    diff,
                }]
            }, [])
                .filter(x => !x.invalid)
        );
    }




    const RESULT = value[0].positions
        // .filter(x => x.bort_number === 3206)
        .map(f => [f.bort_number, calc({bort_number: f.bort_number, revert: false})])

    console.log(RESULT.map(([n,v]) => [n, R.pipe(R.last, R.prop('dist'))(v)]))

// log(RESULT[1])

    writeIfFileExists(`./store/24/26.11.2021-evening.json`, JSON.stringify(RESULT, null, 2))




    function log([bort_number, gg]) {
        console.log(
            `\n${bort_number}`
        )
        console.log(
            gg.map(({time, interval, dist, title, lat, lng}) => (`${title}: ${time.padEnd(8, '0')} ${(interval + '').padStart(20, ' ')} ${(dist+ '').padStart(20, ' ')} ${lat} ${lng}\n`)).join('')
        );
        // console.log(gg.map(({time, interval, dist, lat, lng}) => ({/*time, interval, dist,*/lat, lng})));
        // console.log(gg.length);
        // console.log(gg.map(({time, interval, speed, dist, lat, lng}) => (`${time.padEnd(8, '0')} ${speed}`)).join('\n'));
    }

}



//This function takes in latitude and longitude of two location and returns the distance between them as the interval flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}


function findStartFinishIndexesRecursively (list, revert) {
    const startIndex = list.findIndex((x, i, list) => {
        const b = (calcCrow(x.lat, x.lng, getStartCoordinates(revert)[0], getStartCoordinates(revert)[1]).toFixed(10) * 1000) <= 30; // near 30 TODO
        const next = list[i + 1];
        return b && !(next?.lat === x.lat && next?.lng === x.lng);
    });
    const finishIndex =  1 + list.findIndex((x, i) => calcCrow(x.lat, x.lng, getFinishCoordinates(revert)[0], getFinishCoordinates(revert)[1]).toFixed(10) * 1000 <= 50 && i >= startIndex)
    console.log({startIndex, finishIndex})


    if(finishIndex > startIndex ) {
        return [startIndex, finishIndex]
    } else {
        return findStartFinishIndexesRecursively(list, revert)
    }
}
/*

3206:

A: 17:20:30                    0                    0 0
B: 17:21:30            7.2460048            7.2460048 0
C: 17:22:30          115.0130359          122.2590407 23
D: 17:23:30          321.0858181          443.3448588 29
E: 17:24:30          385.4163458    828.7612045999999 14
F: 17:25:30                    0    828.7612045999999 14
G: 17:26:30   477.60756630000003         1306.3687709 37
H: 17:27:30   213.94218419999999         1520.3109551 10
I: 17:28:30          101.6385246         1621.9494797 8
J: 17:29:30          104.3627354         1726.3122151 1
K: 17:30:30           50.9441825         1777.2563976 10
L: 17:31:30          139.0960469   1916.3524444999998 30
M: 17:32:30   491.44808639999997         2407.8005309 5
N: 17:33:30   258.82396889999995         2666.6244998 12
O: 17:34:30          105.0989329         2771.7234327 20
P: 17:35:30                    0         2771.7234327 20
Q: 17:36:30          935.2127013          3706.936134 38
R: 17:37:30          429.4935585         4136.4296925 14
S: 17:38:30          107,5217079         4243,9514004 28


3205:

A: 17:32:30                    0                    0 50.00191 36.30454
B: 17:33:30          141.8388755          141.8388755 50.00211 36.3065
C: 17:34:30                    0          141.8388755 50.00211 36.3065
D: 17:35:30          766.0223748    907.8612502999999 49.99844 36.31557
E: 17:36:30                    0    907.8612502999999 49.99844 36.31557
F: 17:37:30          642.0476162         1549.9088665 49.99776 36.32449
G: 17:38:30                    0         1549.9088665 49.99776 36.32449
H: 17:39:30   154.12689500000002         1704.0357615 49.99759 36.32663
I: 17:40:30           81.0456085           1785.08137 49.99753 36.32776
J: 17:41:30          160.3949841   1945.4763541000002 49.99728 36.32997
K: 17:42:30           396.479515         2341.9558691 49.99687 36.33548
L: 17:43:30                    0         2341.9558691 49.99687 36.33548
M: 17:44:30          275.4080679          2617.363937 49.9966 36.33931
N: 17:45:30   132.27969489999998         2749.6436319 49.99657 36.34116
O: 17:46:30           23.5395469         2773.1831788 49.99652 36.34148
P: 17:47:30           541.836082   3315.0192607999998 49.99648 36.34906
Q: 17:48:30          166.1343424         3481.1536032 49.99619 36.35134
R: 17:49:30                    0         3481.1536032 49.99619 36.35134
S: 17:50:30    635.8050685999999         4116.9586718 49.99323 36.35895
T: 17:51:30          103.0092083         4219.9678801 49.9924 36.35959

*
*/
