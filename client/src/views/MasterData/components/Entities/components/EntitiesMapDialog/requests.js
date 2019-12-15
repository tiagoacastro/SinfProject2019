import axios from 'axios';

export const getSuppliers = (companyID) => {
    return axios.get(`http://localhost:9000/company/${companyID}/sales/costumers`);
}

export const getCostumers = (companyID) => {
    return axios.get(`http://localhost:9000/company/${companyID}/purchases/suppliers`);
}

export const postMappedEntities = (category, reference_1, reference_2) => {
    return axios.post('http://localhost:9000/entities/map', {
        reference_1: reference_1,
        reference_2: reference_2,
        category: category
    }).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })
}