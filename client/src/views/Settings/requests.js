import axios from 'axios';

export const getCompaniesData = () => {
    return axios({
        method: 'get',
        url: 'http://localhost:9000/settings'
    });
}