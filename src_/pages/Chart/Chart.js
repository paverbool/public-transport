import React from 'react';
import {
    Brush,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine
} from 'recharts';
import {scaleOrdinal} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";

const alph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].map(x => x.toUpperCase())
const nums = alph.reduce((acc, x, i) => ({
    ...acc,
    [x]: i + 1
}), {});
const COLORS = scaleOrdinal(schemeCategory10).range();

const formatTick = (v) => {
    // return `${nums?.[v]} [${v}]`
    const date = new Date(v * 1000);
    return `${date.getMinutes()}`.padStart(2,'0') +':' + `${date.getSeconds()}`.padStart(2,'0');
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
const average = (arr, pr) => arr.reduce( ( p, c ) => p + c[pr], 0 ) / arr.length;

export const Chart = (props) => {
    const trendData = React.useMemo(() =>
        props.data
            .map(([n, v]) => v)
            .reduce((acc, a) => {
                a.forEach((x, xi) => {
                    acc[xi + 1] = [...(acc[xi + 1] || []), x]
                });
                return acc
            }, [])
            .reduce((acc, a) => {
                const interval = average(a, 'interval');
                return [
                    ...acc,
                    {
                        title: a[0].title,
                        interval: interval
                    }
                ]
            }, []), [props.data]);

    return <div>
        <h1>Троллейбус №24</h1>

        <ResponsiveContainer width="100%" height="100%" minHeight={500}>
            <ComposedChart
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
                    dataKey="timestamp"
                    name="timestamp"
                    tickLine={false}
                    // ticks={alph}
                    angle={45}
                    tickFormatter={formatTick}
                    allowDuplicatedCategory={false}
                />

                <YAxis unit={' m'} dataKey="interval" name="interval"/>

                <Tooltip content={<CustomTooltip/>}/>

                <Legend/>

                <ReferenceLine y={0} stroke="#000" />

                {/*<Line dataKey="interval" name={'Среднее'} stroke="#ff7300" data={trendData}/>*/}
                <Line dataKey="interval" name={'Среднее'} stroke="#ff7300" data={props.data[2][1]}/>

                {
                    props.data.slice(2, 3).map(([n, v], i) =>
                        <Scatter
                            dataKey={'interval'}
                            name={n}
                            key={n}
                            type="step"
                             data={v}
                             fill={COLORS[i % COLORS.length]}
                        />
                    )
                }

                <Brush dataKey="interval" height={30} stroke="#8884d8" />


            </ComposedChart>
        </ResponsiveContainer>
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </div>
}


