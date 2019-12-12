import axios from 'axios';

export const getMappedProducts = () => {
    return axios.get('http://localhost:9000/products/mapped');
}

export const postMappedProducts = (productIDCompanyA, productIDCompanyB, name) => {
    return axios.post('http://localhost:9000/products/map', {
        productIDCompanyA: productIDCompanyA,
        productIDCompanyB: productIDCompanyB,
        name: name
    })
}