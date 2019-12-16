
import axios from 'axios';

export const getProcesses = () => {
    return axios.get(`http://localhost:9000/processes`);
}

export const postProcesses = (process) => {
    return axios.post('http://localhost:9000/processes/create', {
        process: process
    })
}