import Map from './pages/Map/Map';
import {Home} from "./pages/Home/Home";
import {Chart} from "./pages/Chart/Chart";
import {ChartByDistance} from "./pages/Chart/ChartByDistance";
import {Route, Routes} from "react-router-dom";
import {ChartByDistance2} from "./pages/Chart/ChartByDistance2";
import {ChartByDistance3} from "./pages/Chart/ChartByDistance3";


const transformDateToReadable = x => ([x[0], x[1].map(f => ({...f, date: new Date(f.date).toDateString()}))]);
const DATA = require('./26.11.2021-morning.json')
    .filter(x => x[1]?.length/* && x[0] === 3204*/)
    .map(transformDateToReadable)
    // .slice(0, 2)
    // .map(x => {
    //     return [x[0], x[1].slice(0, 30)]
    // });

const DATA2_USUAL = require('./26.11.2021-usual.json')
    .filter(x => x[1]?.length/* && x[0] === 3204*/)
    .map(transformDateToReadable)
    // .slice(0, 2)
    // .map(x => {
    //     return [x[0], x[1].slice(0, 30)]
    // });
const DATA3_Evening = require('./26.11.2021-evening.json')
    .filter(x => x[1]?.length/* && x[0] === 3204*/)
    .map(transformDateToReadable)
    // .slice(0, 2)
    // .map(x => {
    //     return [x[0], x[1].slice(0, 30)]
    // });

const PageNotFound = () => <h1>404</h1>;
function App() {
  return (
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="map" element={<Map center={{ lat: 50.0019, lng: 36.30454 }} zoom={15} data={DATA} />} />
                <Route path="chart" element={<Chart data={DATA} />} />
                <Route path="chart/distance" element={<ChartByDistance data={DATA} />} />
                <Route path="chart/distance2" element={<ChartByDistance2 data={DATA} />} />
                <Route path="chart/distance3" element={<ChartByDistance3 data={DATA} data2={DATA2_USUAL} data3={DATA3_Evening} />} />
                <Route path="*" element={<PageNotFound/>} />
            </Route>
        </Routes>
  );
}

export default App;
