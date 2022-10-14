import {Link} from "react-router-dom";

export const Home = () => {
    return <div>
        <h1>Home</h1>
        <nav>
            <Link to="/map">map</Link><br/>
            <Link to="/chart">chart</Link><br/>
            <Link to="/chart/distance">chart by distance</Link><br/>
        </nav>
    </div>
}
