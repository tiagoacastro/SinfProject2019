import axios from 'axios';

export const getSalesItems = (companyID) => {
    return axios.get(`http://localhost:9000/products/company/${companyID}/sales/items`);
}

export const getPurchaseItems = (companyID) => {
    return axios.get(`http://localhost:9000/products/company/${companyID}/purchase/items`);
}

export const postMappedProducts = (reference_1, reference_2) => {
    return axios.post('http://localhost:9000/products/map', {
        reference_1: reference_1,
        reference_2: reference_2
    }).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })
}