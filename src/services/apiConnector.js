import axios from 'axios';

export const axiosInstance=axios.create({
    timeout:5000,
});

export const apiConnector = (method,url)=>{
    console.log("Making API call with parameters:", { method, url });
    return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    });
}