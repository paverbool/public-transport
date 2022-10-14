import * as React from 'react';
import {Layout} from "./components/Layout";
import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home/Home";
import {RoutesMap} from "./pages/RoutesMap/RoutesMap";
import {NoMatch} from "./pages/NoMatch";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="routes" element={<RoutesMap/>}/>

                {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                <Route path="*" element={<NoMatch/>}/>
            </Route>
        </Routes>
    );
}

export default App;
