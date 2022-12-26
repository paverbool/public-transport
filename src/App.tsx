import * as React from 'react';
import {Layout} from "./components/Layout";
import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home/Home";
import {RoutesMap} from "./pages/RoutesMap/RoutesMap";
import {NoMatch} from "./pages/NoMatch";
import { QueryClientProvider } from 'react-query';
import {queryClient} from "./API/queryClient";
import {Budget} from "./pages/Budget";


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="routes" element={<RoutesMap/>}/>
                    <Route path="budget" element={<Budget/>}/>

                    {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                    <Route path="*" element={<NoMatch/>}/>
                </Route>
            </Routes>
        </QueryClientProvider>
    );
}

export default App;
