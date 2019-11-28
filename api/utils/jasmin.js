var axios = require('axios');
const FormData = require('form-data');

function getAcessToken() {

    let bodyData = generateBodyDataToken();

    sendTokenRequest('post', 'https://identity.primaverabss.com/connect/token', bodyData).then((res) => {
      axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.access_token;
      getStockTransferOrders();
    }).catch((err) => {
      console.log(err);
    });
}

function getStockTransferOrders() {
  sendRequest('get', 'http://my.jasminsoftware.com/api/224814/224814-0001/materialsmanagement/stockTransferOrders').then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
}

function sendRequest(method, url, bodyData) {
    return axios({
      url: url,
      method: method,
      data: bodyData,
      responseType: 'json',
      headers: {...new FormData().getHeaders}
    });
}

function sendTokenRequest(method, url, bodyData) {
  return axios({
    url: url,
    method: method,
    data: bodyData,
    headers: {...bodyData.getHeaders()}
  });

}

function generateBodyDataToken() {
    let bodyData = new FormData();

    bodyData.append("client_id","FEUP-SINF-V");
    bodyData.append("client_secret", "c9aad44c-b151-49bf-aa87-cd6163a5a8b9");
    bodyData.append("grant_type", "client_credentials");
    bodyData.append("scope", "application");

    return bodyData;
}



module.exports = {getAcessToken, sendRequest};
