import axios from 'axios';

export const getMappedProducts = () => {
    return axios.get('http://localhost:9000/products/mapped');
}