import axios from 'axios';

export const getLogs = () => {
    return axios({
        method: 'get',
        url: 'http://localhost:9000/logs'
    });
}