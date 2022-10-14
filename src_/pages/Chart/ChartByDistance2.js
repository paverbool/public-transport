import React from 'react';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {scaleOrdinal} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import {useCurrentPng} from "recharts-to-png";
import FileSaver from "file-saver";
import {ChartByDistance2Table} from "./ChartByDistance2Table";
import {Button, Container, Typography} from "@mui/material";
import {average} from "../../helpers";

const COLORS = scaleOrdinal(schemeCategory10).range();

const getSegments = () => ({
    to602: [
        {id: 1, length: 280, intersection: 'Академика Павлова', title: 'Отрезок #1 Метро - Академика Павлова'},
        {id: 2, length: 700, intersection: 'Льва Ландау', title: 'Отрезок #2 Академика Павлова - Льва Ландау'},
        {
            id: 3,
            length: 950,
            intersection: 'Гвардейцев Широненцев',
            title: 'Отрезок #3 Льва Ландау - Гвардейцев-Широненцев'
        },
        {
            id: 4,
            length: 850,
            intersection: 'Тракторостроителей',
            title: 'Отрезок #4 Гвардейцев-Широненцев - Тракторостроителей'
        },
        {id: 5, length: 1580, intersection: '602', title: 'Отрезок #5 Тракторостроителей - 602'},
    ],
    toMetro: [
        {
            id: 1,
            length: 1580,
            dist: 1580,
            intersection: 'Тракторостроителей',
            title: 'Отрезок #1 602 - Тракторостроителей'
        },
        {
            id: 2,
            length: 850,
            dist: 1580 + 850,
            intersection: 'Гвардейцев-Широненцев',
            title: 'Отрезок #2 Тракторостроителей - Гвардейцев-Широненцев'
        },
        {
            id: 3,
            length: 950,
            dist: 1580 + 850 + 950,
            intersection: 'Льва Ландау',
            title: 'Отрезок #3 Гвардейцев-Широненцев - Льва Ландау'
        },
        {
            id: 4,
            length: 700,
            dist: 1580 + 850 + 950 + 700,
            intersection: 'Академика Павлова',
            title: 'Отрезок #4 Льва Ландау - Академика Павлова '
        },
        {
            id: 5,
            length: 240,
            dist: 1580 + 850 + 950 + 700 + 240,
            intersection: 'Метро',
            title: 'Отрезок #5 Академика Павлова - Метро'
        },
    ]
});
const TO_METRO = getSegments().toMetro
const TO_METRO_LABELS = [0, ...getSegments().toMetro.map(x => x.dist)]
const TO_METRO_MAPPED_LABELS = TO_METRO_LABELS.reduce((acc,x )=> {
    return {
        ...acc,
        [x]: TO_METRO.find(d => d.dist === x)?.intersection || x
    }
},{})
console.clear();

console.log(123123123,TO_METRO_MAPPED_LABELS);

const CustomizedAxisTick = ({ x, y, index, payload}) =>
    (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={10} fontSize={14} textAnchor="end" fill="#666">
                {TO_METRO[index - 1]?.intersection}
            </text>
            <text x={0} y={12} dy={10} fontSize={10} textAnchor="end" fill="#666">
                ({payload.value} м)
            </text>
        </g>
    )


export const ChartByDistance2 = (props) => {
    const [selectedV, setSelectedV] = React.useState(0)
    const _data = React.useMemo(() =>
        props.data
            .filter(x => x[0] !== 3225) // todo
            // .slice(0,) //todo
            .map((v) => {
                const routeLength = v[1][v[1].length - 1].dist
                const segments = getSegments().toMetro; //todo
                let sIndex = 0;
                let start = 0
                return [
                    v[0],
                    v[1].map((x, i, list) => {
                        const avSpeed = x.interval / x.diff * 60 * 60 / 1000;

                        console.log(111,avSpeed)
                        if (
                            (sIndex <= segments.length - 1 &&
                                x.dist - 30 >= segments?.[sIndex]?.dist) ||
                            i === list.length - 1 && segments[sIndex]
                        ) {
                            const itDist = x.dist - list[start].dist;
                            const spendTime = x.timestamp - list[start].timestamp;
                            segments[sIndex].avSpeed = itDist / spendTime * 60 * 60 / 1000
                            segments[sIndex].completedDist = itDist;
                            segments[sIndex].spendTime = spendTime;
                            sIndex++;
                            start = i;
                        }
                        return ({
                            ...x,
                            avSpeed: avSpeed,
                            completed: x.dist / routeLength * 100
                        });
                    })
                        .filter(x => !x.invalid),
                    [
                        {id: 0, length: 0, dist: 0, title: 'start', avSpeed: 0},
                        ...segments
                    ]
                ]
            }).splice(0), [props.data]);


    const _dataSum = React.useMemo(() =>
        TO_METRO
            .map((meta) => _data.map(([n, _, xxxx]) => xxxx.find(x => meta.id === x.id)))
            .reduce((acc, x) => {
                console.log(x.map(x => x.avSpeed));

                return [...acc, {
                    dist: x[0].dist,
                    avSpeed: average(x.filter(xs => typeof xs.avSpeed === 'number'), 'avSpeed')
                }];
            }, []),
        [_data]
    );

    // const selected = _data[selectedV];
    // const gen = getav(selected)

    const [getPng, {ref, isLoading}] = useCurrentPng();

    const handleDownload = React.useCallback(async () => {
        const png = await getPng();

        // Verify that png is not undefined
        if (png) {
            // Download with FileSaver
            FileSaver.saveAs(png, 'myChart.png');
        }
    }, [getPng]);

    const [opacity, setOpacity] = React.useState(null)
    const handleMouseEnter = (o) => {
        const {value} = o;
        setOpacity(value === opacity ? null : value)
    };

    return <Container>
        <Typography variant={'h2'}>Троллейбус №24 - Расстояние</Typography>
        <ChartByDistance2Table data={_data}/>

        <ResponsiveContainer width="100%" height="100%" minHeight={600}>
            <ComposedChart
                ref={ref}
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
                    domain={["dataMin", "dataMax"]}
                    dataKey="dist"
                    tickCount={100}
                    type="number"
                    unit={' м'}
                />
                <XAxis
                    domain={["dataMin", "dataMax"]}
                    dataKey="dist"
                    type="number"
                    height={40}
                    ticks={TO_METRO_LABELS}
                    tick={<CustomizedAxisTick/>}
                    xAxisId="dist"
                />
                <YAxis
                    type="number"
                    dataKey="avSpeed"
                    name="avSpeed"
                    tickCount={15}
                    unit={' км/ч'}
                />


                <Tooltip/>

                <Legend onMouseDown={handleMouseEnter}/>

                {
                    _data.map(([n, _, v], i) =>
                        <Area
                            type={'stepBefore'}
                            dataKey={'avSpeed'}
                            name={n}
                            key={n}
                            data={v}
                            dot={opacity === n}
                            strokeWidth={opacity === n ? 5 : 0}
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                            opacity={opacity === n ? 1 : 0.5}
                        />
                    )
                }
                <Line
                    type={'linear'}
                    dataKey={'avSpeed'}
                    data={_dataSum}
                    strokeWidth={6}
                />
                {TO_METRO.map((x) => <ReferenceLine
                    key={x.id}
                    x={x.dist}
                    stroke={'red'}
                    strokeOpacity={0.4}
                    strokeDasharray="3 3"
                    label={x.id}
                    angle={90}
                />)}

            </ComposedChart>
        </ResponsiveContainer>
        <Button onClick={handleDownload}>
            {isLoading ? 'Downloading...' : 'Download Chart'}
        </Button>
    </Container>
}

function getav([n, v]) {
    const last = v[v.length - 1];
    const it = v[0];
    const diff = (last.timestamp - it.timestamp) / 60;
    return {
        bort: n,
        diff: diff + ' мин',
        avSpeed: (last.dist / diff * 60 / 1000).toFixed(3) + ' км/ч',
    }
}



