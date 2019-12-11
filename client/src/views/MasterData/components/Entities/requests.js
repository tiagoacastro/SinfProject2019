import axios from 'axios';

export const getClients = () => {
    return axios({
        method: 'get',
        url: 'http://localhost:9000/clients'
    });
}