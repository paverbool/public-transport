/* global google */
import React from "react";
import {GoogleApiWrapper, Map, Polyline} from "google-maps-react";
import {Marker} from "./Marker";

const styles = require('../../styles.json');

export const GOOGLE_MAPS_API_KEY = "AIzaSyD3wYrkz0aB8X4paloaQrtiiFW-5plYSlQ"

const MapContainer = (props) => {
    return (
        <div className="map-container">
            <Map
                google={props.google}
                // className={"map"}
                styles={styles}
                zoom={props.zoom}
                initialCenter={props.center}
            >
                {
                    props.data
                        .filter(x => x[0] === 3206) //todo
                        .map(([n, d]) =>
                            [
                                d.map((position, i) =>
                                        // position.title <= 75 &&  position.title >= 60 ?
                                    <Marker
                                key={position.title + n}
                                zIndex={i}
                                shape={'circle'}
                                label={{
                                    color: 'white',
                                    fontSize: "10",
                                    text: `${n}-${position.title}`,
                                }}
                                optimized={true}
                                title={JSON.stringify({...position, bort: n}, null, 2)}
                                // opacity={1}
                                position={position}
                                />
                                    // : null
                                ),
                            <Polyline
                                fillColor="#0000FF"
                                fillOpacity={0.35}
                                path={d}
                                strokeColor="#0000FF"
                                strokeOpacity={0.8}
                                strokeWeight={2}
                            />
                        ]
                    )
                }
            </Map>
        </div>
    );
}


export default GoogleApiWrapper({
    apiKey: GOOGLE_MAPS_API_KEY,
    language: 'uk',
    region: 'UA',
    libraries: [],
})(MapContainer);
