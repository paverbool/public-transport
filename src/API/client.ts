import axios from "axios";

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3004/api/' : '/api/'

export const client = axios.create({
    baseURL: baseUrl
})