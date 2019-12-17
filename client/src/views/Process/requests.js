
import axios from 'axios';

export const getProcesses = () => {
    return axios.get(`http://localhost:9000/processes`);
}

export const postProcesses = (process) => {
    return axios.post('http://localhost:9000/processes/create', {
        process: process
    })
}

export const disableProcesses = (id_process, active) => {
    return axios.post('http://localhost:9000/processes/disable', {
        id_process: id_process,
        active: active
    })
}