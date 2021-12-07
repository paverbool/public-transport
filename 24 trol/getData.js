import fetch from 'node-fetch';
import fs from'fs';

const _fetch = async (endpoint, options) => {
    try {
        const response = await fetch(endpoint, options);
        const txt = await response.text();
        return JSON.parse(txt.trim());
    } catch (e) {
        console.log(e)
    }
}

export function getData() {

    const t = async () => {
        console.info('start')
        const data = await _fetch('http://194.28.84.113/troll/trol.json');
        try {
            const rawData = await fs.readFileSync('./store/trol24.json');
            const collect = JSON.parse(rawData);
            const positions24 = data.positions
                .filter(x => x.number === '24');
            if (positions24.length) {
                const json = JSON.stringify([...collect, {
                    ...data,
                    positions: positions24
                }]);
                fs.writeFileSync('./store/trol24.json', json);
            }
        } catch (e) {
            console.error(e)
        }
    }
    t()
    setInterval(async () => {
        t()
    }, 10 * 1000);
}

