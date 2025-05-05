import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function setHeaders(customHeaders = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    return headers;
}

export async function get(url: string, customHeaders = {}) {
    const headers = await setHeaders(customHeaders);
    try {
        const response = await axios.get(url, { headers });
        const rsp = response.data;
        console.log("FETCH==>", rsp);
        return rsp;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function post(url: string, data: any, customHeaders = {}) {
    console.log("POSTREQUEST==>", data);
    const headers = await setHeaders(customHeaders);
    try {

        const response = await axios.post(url, data, {headers});
        const rsp = response.data;
        console.log("RESPONSE==>", rsp);
        return rsp;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
