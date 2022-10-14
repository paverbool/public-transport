import * as R from "ramda";

export const average = (arr, pr) => arr.reduce((p, c) => p + c[pr], 0) / arr.length;
export const calcSpeed = (dist, time) => dist / time * 60 * 60 / 1000;
export const toReadableTime = (timestamp) => {
    const d = new Date(timestamp * 1000);
    const hh = `${d.getHours()}`.padStart(2, '0')
    const mm = `${d.getMinutes()}`.padStart(2, '0')
    const ss = `${d.getSeconds()}`.padEnd(2, '0')
    return `${hh}:${mm}:${ss}`
};
