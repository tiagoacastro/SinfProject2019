import axios from 'axios';

export const getMappedEntities = () => {
    return axios.get('http://localhost:9000/entities/mapped');
}

export const getCustomerReferences = async () => {
    const options_1 = await axios.get(`http://localhost:9000/company/1/sales/costumers`);
    const options_2 = await axios.get(`http://localhost:9000/company/2/sales/costumers`);
    return { options_1: options_1.data, options_2: options_2.data }
}

export const getSupplierReferences = async () => {
    const options_1 = await axios.get(`http://localhost:9000/company/1/purchases/suppliers`);
    const options_2 = await axios.get(`http://localhost:9000/company/2/purchases/suppliers`);
    return { options_1: options_1.data, options_2: options_2.data }
}

export const deleteMappedEntities = (id) => {
    return axios.delete(`http://localhost:9000/entities/${id}`)
        .then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
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