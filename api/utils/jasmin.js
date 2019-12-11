var axios = require('axios');
const FormData = require('form-data');

function getAcessToken() {

  let grapeData = generateGrapeBody();
  let wineData = generateWineBody();

  sendTokenRequest('post', 'https://identity.primaverabss.com/connect/token', grapeData).then((res) => {
    global.grapeToken = "Bearer " + res.data.access_token;
  }).catch((err) => {
    console.log(err);
  });

  sendTokenRequest('post', 'https://identity.primaverabss.com/connect/token', wineData).then((res2) => {
    global.wineToken = "Bearer " + res2.data.access_token;
  }).catch((err) => {
    console.log(err);
  });
}

function sendRequest(method, url, company, bodyData) {
  var headers = { ...new FormData().getHeaders };
  if (company === 1) {
    headers['Authorization'] = global.grapeToken;
  } else if (company === 2) {
    headers['Authorization'] = global.wineToken;
  }
 
  return axios({
    url: url,
    method: method,
    data: bodyData,
    responseType: 'json',
    headers: headers
  });
}

function sendTokenRequest(method, url, bodyData) {
  return axios({
    url: url,
    method: method,
    data: bodyData,
    headers: { ...bodyData.getHeaders() }
  });

}

function generateGrapeBody() {
  let bodyData = new FormData();

  bodyData.append("client_id", "FEUP-SINF-V");
  bodyData.append("client_secret", "c9aad44c-b151-49bf-aa87-cd6163a5a8b9");
  bodyData.append("grant_type", "client_credentials");
  bodyData.append("scope", "application");

  return bodyData;
}

function generateWineBody() {
  let bodyData = new FormData();

  bodyData.append("client_id", "FEUP-SINF-V-2");
  bodyData.append("client_secret", "291aeb16-f709-4954-96db-6ba7a8cb889b");
  bodyData.append("grant_type", "client_credentials");
  bodyData.append("scope", "application");

  return bodyData;
}




module.exports = { getAcessToken, sendRequest };
