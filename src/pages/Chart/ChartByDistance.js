import React from 'react';
import {
    Area, Bar,
    Brush,
    CartesianGrid,
    ComposedChart,
    Legend, Line,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {scaleOrdinal} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";

const alph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].map(x => x.toUpperCase())
const nums = alph.reduce((acc, x, i) => ({
    ...acc,
    [x]: i + 1
}), {});
const COLORS = scaleOrdinal(schemeCategory10).range();

const formatTick = (v) => {
    return `${nums?.[v]} [${v}]`
};

const CustomTooltip = (g) => {
    if (g.active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Пройдено: ${JSON.stringify(g.payload?.[0]?.payload?.interval)} м`}</p>
                {/*<p className="desc">Anything you want can be displayed here.</p>*/}
            </div>
        );
    }
    return null
}
const average = (arr, pr) => arr.reduce((p, c) => p + c[pr], 0) / arr.length;

export const ChartByDistance = (props) => {
    const [selectedV, setSelectedV] = React.useState(0)
    const _data = React.useMemo(() =>
        props.data.map((v) => {
            const routeLength = v[1][v[1].length - 1].dist
            return [
                v[0],
                v[1].map((x) => {
                    const avSpeed = x.interval / x.diff * 60 * 60 / 1000;
                    return ({
                        ...x,
                        avSpeed: avSpeed,
                        // completed: x.dist / routeLength * 100
                        completed: Math.round(x.dist/10)*10
                    });
                })
                .filter(x => !x.invalid)
            ]
        }).splice(0), [props.data]);

    const trendData = React.useMemo(() =>
        _data
            .map(([n, v]) => v)
            .reduce((acc, a) => {
                a.forEach((x, xi) => {
                    acc[xi + 1] = [...(acc[xi + 1] || []), x]
                });
                return acc
            }, [])
            .reduce((acc, a) => {
                return [
                    ...acc,
                    {
                        completed: average(a, 'completed'),
                        avSpeed: average(a, 'avSpeed')
                    }
                ]
            }, []), [_data]);
    const selected = _data[selectedV];
    console.info(selected);
    const gen = getav(selected)

    const [getPng, { ref, isLoading }] = useCurrentPng();

    // Can also pass in options for html2canvas
    // const [getPng, { ref }] = useCurrentPng({ backgroundColor: '#000' });

    const handleDownload = React.useCallback(async () => {
        const png = await getPng();

        // Verify that png is not undefined
        if (png) {
            // Download with FileSaver
            FileSaver.saveAs(png, 'myChart.png');
        }
    }, [getPng]);


    return <div>
        <h1>Троллейбус №24 - Расстояние</h1>

        <ResponsiveContainer width="100%" height="100%" minHeight={700}>
            <ComposedChart
                ref={ref}
                width={400}
                height={500}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid/>
                <XAxis
                    // type="category"
                    dataKey="completed"
                    // allowDecimals={true}
                    tickCount={21}
                    type="number"
                />
                {/*<YAxis  dataKey="dist"/>*/}
                <YAxis
                    type="number"
                    dataKey="avSpeed"
                    name="avSpeed"
                    // scale={'linear'}
                    unit={' км/ч'}
                />


                <Tooltip/>

                <Legend/>

                <ReferenceLine y={0} stroke="#000"/>

{/*                <Line
                    dataKey="avSpeed"
                    name={'Среднее'}
                    stroke="black"
                    strokeWidth={"3"}
                    data={selected[1]}
                    // type={'stepAfter'}
                    legendType={'rect'}
                />*/}

                {
                    _data.map(([n, v], i) =>
                        <Scatter
                            dataKey={'avSpeed'}
                            name={n}
                            key={n}
                            data={v}
                            // legendType={'rect'}
                            strokeWidth
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                        />
                    )
                }

                {/*<Brush dataKey="interval" height={30} stroke="#8884d8"/>*/}


            </ComposedChart>
        </ResponsiveContainer>
        <pre>
            <code>
            Номер борта: {gen.bort}<br/>
            Время: {gen.diff}<br/>
            Ср. скорость: {gen.avSpeed}
            </code>

        </pre>
        {/*<pre>{JSON.stringify(getav(selected), null, 2)}</pre>*/}
        {/*<pre>{JSON.stringify(_data, null, 2)}</pre>*/}
        <select name="" id="" onChange={(e) => setSelectedV(e.target.value)}>
            {
                _data.map((x,i) => <option key={x[0]} value={i}>{x[0]}</option>)
            }
        </select>
        <button onClick={handleDownload}>
            {isLoading ? 'Downloading...' : 'Download Chart'}
        </button>
    </div>
}

function getav ([n, v]) {
    const last = v[v.length - 1];
    const it = v[0];
    const diff = (last.timestamp - it.timestamp) /60;
    return {
        bort: n,
        diff: diff + ' мин',
        avSpeed: (last.dist / diff * 60 / 1000).toFixed(3) + ' км/ч',
    }
}



