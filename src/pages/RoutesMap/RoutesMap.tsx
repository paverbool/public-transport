import React, {useMemo} from 'react';
import {LayersControl, MapContainer, Pane} from 'react-leaflet'
import {RoutesNetwork} from "./components/RoutesNetwork";
import RoutesNav from "./components/RoutesNav";
import {Watermark} from "./components/Watermark";
import {Loading} from "./components/Loading";
import {TileLayers} from "./components/TileLayers";
import {DensityLayers} from "./components/DensityLayers";
import {IsochronesByMarker} from "./components/IsochronesByMarker";
import {InformBox} from "./components/InformBox";
import {StopsHeatMap} from "./components/StopsHeatMap";
import {useLocation} from "react-router-dom";
import {useRoutesMap,} from "./useRoutesMap";


export const RoutesMap = () => {
    const {search} = useLocation();
    const cityQuery: 'kharkiv' | 'lviv' = useMemo(() => {
        const q = new URLSearchParams(search.substring(1));
        return q.get('city') as 'kharkiv' || 'kharkiv'
    }, [search])
    const {checked, setChecked, currentCity, routesRawData,unifiedIsochronesQuery} = useRoutesMap(cityQuery);


    const [enabledIsochronesByMarker, setEnabledIsochronesByMarker] = React.useState(false);
    const [areaData, setAreaData] = React.useState<any>(null); //todo refactor or remove
    if (routesRawData.isLoading) return <Loading/>;

    return <>
        <RoutesNav
            checked={checked}
            setChecked={setChecked}
            routes={routesRawData.data!._forMenu}
            enabledIsochronesByMarker={enabledIsochronesByMarker}
            setEnabledIsochronesByMarker={setEnabledIsochronesByMarker}

        />
        <MapContainer
            center={currentCity.position}
            zoom={12}
            style={{height: '100vh'}}>
            <InformBox areasData={areaData}/>
            <LayersControl position="topleft">
                <TileLayers/>
                <IsochronesByMarker
                    checked={checked}
                    enabled={enabledIsochronesByMarker}
                    routes={routesRawData.data!._forIsochrones}
                    setChecked={setChecked}
                    setAreaData={setAreaData}
                />
                <DensityLayers/>
                <LayersControl.Overlay name={'Теплова карта'}>
                    <StopsHeatMap data={routesRawData.data!._forIsochrones}/>
                </LayersControl.Overlay>

            </LayersControl>
            <Pane name={'RoutesNetwork'} style={{zIndex: 200}}>
                {
                    currentCity.networks.map((nn) =>
                        <RoutesNetwork
                            key={nn}
                            isochrones={unifiedIsochronesQuery?.data?.[nn]}
                            transport={nn}
                            checked={checked[nn]}
                            routesData={routesRawData.data![nn]}/>)
                }
            </Pane>
            <Watermark/>
        </MapContainer>
    </>
}
