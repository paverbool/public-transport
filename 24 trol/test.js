let i = 0;
function search(list, add = 0) {
    const start = list.findIndex(x => x % 6 === 0)
    const finish = list.findIndex((x, i) => (x % 5 === 0) && (i >= start))
    console.log(start, finish);
    i++;
    if (i === 10) return [0, 0]
    if (start > finish) {
        return search(list, finish);
    } else {
        return [start, finish]
    }
}


const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 123, 304, 345];


const [st, fi] = search(list);
console.log([st, fi]) // [6, 10]
console.log(list[st], list[fi]) // [6, 10]
