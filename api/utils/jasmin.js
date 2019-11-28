const axios = require('axios');
const FormData = require('form-data');

function getAcessToken() {

    let bodyData = generateBodyData();

    sendRequest('post', 'https://identity.primaverabss.com/connect/token', bodyData).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
}

function sendRequest(method, url, bodyData) {
    return axios({
      url: url,
      method: method,
      data: bodyData,
      headers: {...bodyData.getHeaders()}
    });
}

function generateBodyData() {
    let bodyData = new FormData();

    bodyData.append("client_id","FEUP-SINF-V");
    bodyData.append("client_secret", "c9aad44c-b151-49bf-aa87-cd6163a5a8b9");
    bodyData.append("grant_type", "client_credentials");
    bodyData.append("scope", "application");

    return bodyData;
}



module.exports = {getAcessToken};
