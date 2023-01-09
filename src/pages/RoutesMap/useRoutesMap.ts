import {useMutation, useQuery} from "react-query";
import {citiesConfig, CitiesKeys} from "../../contsants/constants";
import {routesAPI} from "../../API/routes";
import {CheckedRoutes, MetaRawData, RawDataItem, RouteData, RouteRawData, RoutesResponse} from "./types";
import React, {useCallback, useMemo} from "react";
import * as R from "ramda";
import {PathOptions} from "leaflet";
import {stopsUnifiedIsochronesAPI} from "../../API/stopsUnifiedIsochronesAPI";

const order: Record<string, number> = {
    'Метро': 1,
    'Трамвай': 2,
    'Тролейбус': 3,
    'Автобус': 4,
    'Приміський': 5,
    'Маршрутка': 6,
}

type Keys = keyof typeof order;

type RoutesForIsochrones = {
    routes: RouteData[];
    transport: string
};

type RoutesMapData = {
    _forMenu: {
        transport: string
        routes: MetaRawData[];
    }[];
    _forIsochrones: RoutesForIsochrones[]
} & Partial<Record<string, RouteData[]>>

export const useRoutesMap = (cityQuery: CitiesKeys) => {
    const [checked, setCheckedFn] = React.useState<CheckedRoutes>({});
    const setChecked = (checked: CheckedRoutes) => {
        unifiedIsochronesQuery.mutate(getCheckedIds(checked))
        setCheckedFn(checked)
    };
    const currentCity = useMemo(() => citiesConfig[cityQuery] || citiesConfig['kharkiv'], [cityQuery]);

    const unifiedIsochronesQuery = useMutation({
        mutationKey: ['isochrones', 'unify'],
        mutationFn: (ids: Record<string, number[]>) => stopsUnifiedIsochronesAPI({city: cityQuery, ids}),
    });

    const routesRawData = useQuery<RoutesResponse, any, RoutesMapData>({
        queryKey: ['routes', cityQuery],
        queryFn: () => routesAPI(cityQuery, currentCity.networks),
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            const checked = data!._forMenu
                .reduce<Record<string, any>>((acc, v) => ({
                    ...acc,
                    [v.transport]: {
                        checked: false,
                        indeterminate: false,
                        children: v.routes
                            .reduce((acc: any, v: any) => ({
                                ...acc,
                                [v.ri]: false
                            }), {})

                    }
                }), {});
            setChecked(checked)

            // unifiedIsochronesQuery.mutate()
        },
        select: (rawData) => {
            const rest = currentCity.networks.reduce<Partial<Record<string, RouteData[]>>>((acc, nn) => ({
                ...acc,
                [nn]: prepareData(rawData[nn])
            }), {});

            let sortedData = Object.entries(rawData)
                .sort((a, b) => (order[a[0]] || 0) - (order[b[0]] || 0));
            const result = {
                ...rest,
                _forMenu: sortedData
                    .map(([k, v]) => ({
                        transport: k,
                        routes: v.map((x) => x.meta)
                    })),
                _forIsochrones: sortedData
                    .map(([k, v]) => ({
                        transport: k,
                        routes: prepareData(v, {})
                    })),
            };
            return result as RoutesMapData;
        }
    });


    return {checked, setChecked, currentCity, routesRawData, unifiedIsochronesQuery}
}


function getRouteData(data: RouteRawData) {
    return `${data.points?.forward || []} ${data.points?.backward || []}`.split(' ').map(x => {
        const [lat, lng] = x.split(',');
        return ({
            lat: Number(lat),
            lng: Number(lng)
        });
    });
}

function getStops(data: RouteRawData) {
    return [...(data.stops?.forward || []), ...(data.stops?.backward || [])].map(x => ({
        i: x.i,
        lat: x.x,
        lng: x.y,
    }))
}

function prepareData(rawData: RawDataItem[], options: PathOptions = {color: 'black'}): RouteData[] {
    // const randomColor = getRandomColor();
    return rawData
        .map((x) => ({
            number: x.id,
            id: x.id,
            meta: x.meta,
            routePath: getRouteData(x.route),
            stops: getStops(x.route),
            color: options.color || 'black',
            routePathOptions: {color: 'black', weight: 0.3, ...options},
        }))
}


function getCheckedIds(checked: CheckedRoutes): Record<string, number[]> {
    return Object.entries(checked)
        .reduce((acc, [trKey, x]) => ({
            ...acc,
            [trKey]: Object.entries(x.children)
                .filter(([k, v]) => v)
                .map(([k]) => Number(k)) || []
        }), {})
}