import axios from 'axios';

export const getMappedEntities = () => {
    return axios.get('http://localhost:9000/entities/mapped');
}

export const deleteMappedEntities = (id) => {
    return axios.delete(`http://localhost:9000/entities/${id}`)
        .then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err)
        })
}