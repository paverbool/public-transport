import axios from "axios";

export const routesAPI = async () => {
    const {data} = await axios.get('http://localhost:3004/routes') // todo
    return data
}