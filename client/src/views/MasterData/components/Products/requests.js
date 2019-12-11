import axios from 'axios';

export const getProcesses = () => {
    return axios({
        method: 'get',
        url: 'http://localhost:9000/products'
    });
}