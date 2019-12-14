import axios from 'axios';

export const getMappedEntities = () => {
    return axios.get('http://localhost:9000/entities/mapped');
}