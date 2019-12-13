import axios from 'axios';

export const getCompaniesData = () => {
    return axios.get(`http://localhost:9000/company`);
}