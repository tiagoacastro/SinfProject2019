import axios from 'axios';

export const getMappedProducts = () => {
    return axios.get('http://localhost:9000/products/mapped');
}

export const deleteMappedProducts = (id) => {
    return axios.delete(`http://localhost:9000/products/${id}`)
        .then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
}