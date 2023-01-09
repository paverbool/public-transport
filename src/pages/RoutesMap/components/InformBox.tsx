import React, {useEffect, useLayoutEffect, useMemo, useState} from "react";
import Box from "@mui/material/Box";
import area from "@turf/area";
import {convertArea, featureCollection, polygon, multiPolygon} from "@turf/helpers";
import {Paper, Typography} from "@mui/material";
import {FeatureCollection, Polygon, MultiPolygon} from "geojson";
import union from "@turf/union";
import {Feature} from "@turf/helpers/dist/js/lib/geojson";
import * as R from "ramda";
import {prepend} from "ramda";

const heavy_process = new Worker( /* webpackChunkName: "union-worker" */  new URL('./heavy_process', import.meta.url));

interface Props {
    areasData: Record<string, any>
    debugData?: any
}

const id = '(*G(*)(jsidnuyd86098ad-0as-djanksdaksdjasd';

export const InformBox: React.FC<Props> = ({areasData, debugData}) => {
    const [totalUnited, setTotalUnited] = useState<number | string>(0);
    const [_area, set_area] = useState<Record<string, number | string>>({
            'Метро': 0,
            'Трамвай': 0,
            'Тролейбус': 0,
            'Автобус': 0,
            'Маршрутка': 0,
            'Приміський': 0,
            'total': 0,
        }
    );

    useEffect(() => {
        console.log('RECALCULATE=================================')
        // setTotalUnited(0);
        const r: Record<string, number | string> = {
            'Метро': 0,
            'Трамвай': 0,
            'Тролейбус': 0,
            'Автобус': 0,
            'Маршрутка': 0,
            // 'Приміський': 0, // todo
            'total': 0,
        }
        let totalFeatures: any[] = [];

        Object.entries(areasData || {}).forEach(([k, areaData]) => {
            if (areaData) {
                const a = (+convertArea(area(areaData), 'meters', 'kilometers') || 0).toFixed(2);
                // @ts-ignore
                r[k] = a
                totalFeatures = [...totalFeatures, areaData]
            }
        });
        if (totalFeatures.length > 0) {
            const features = featureCollection<any>(totalFeatures);
            r['total'] = (Object.values(r).reduce((sum: number, a) => sum + Number(a), 0) || 0).toFixed(2) as string;
            heavy_process.postMessage({
                data: features,
                transport: id,
            });
        }
        set_area(r);
    }, [/*areasData*/]);

    useEffect(() => {
        heavy_process.addEventListener('message', ({data: {result, transport: _transport}}) => {
            if (id === _transport) {
                setTotalUnited((convertArea(area(result), 'meters', 'kilometers') || 0).toFixed(2));
            }
        });
    }, []);

    return null
    return <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 999999,
        width: 300,
        maxWidth: '100%'

    }}>
        <Paper style={{padding: 8}}>
            <Typography>Площа покриття</Typography>
            <code>
                {
                    debugData ?
                        <pre>{JSON.stringify(debugData, null, 2)}</pre> :
                        <pre>
                    Метро: {_area['Метро']} км² <br/>
                    Трамвай: {_area['Трамвай']} км² <br/>
                    Тролейбус: {_area['Тролейбус']} км² <br/>
                    Автобус: {_area['Автобус']} км² <br/>
                    Маршрутка: {_area['Маршрутка']} км² <br/>
                            {/*Приміський: {_area['Приміський']} км² <br/>*/}
                            <b>Взагалі</b>: {_area['total']} км² <br/>
                    <b>Разом*</b>: {totalUnited} км² <br/>
                </pre>
                }
            </code>
        </Paper>
    </Box>
}
