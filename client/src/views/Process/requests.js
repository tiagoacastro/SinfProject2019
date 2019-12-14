
import axios from 'axios';

export const getProcesses = () => {
    return axios.get(`http://localhost:9000/processes`);
}