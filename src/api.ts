import {HttpClient} from 'aurelia-fetch-client';

let host = "http://api.educa.iamedu.io"

export class Api {
  login(username: string, password: string) {
    let client = new HttpClient();
    let data = new FormData() as any;
    data.set('username', username);
    data.set('password', password);
    data.set('grant_type', 'password');
    return client.fetch(host + "/oauth/token", {
      method: "POST",
      body: data,
      headers: {
        'Authorization': 'Basic ' + btoa('acme:acmesecret'),
      }
    })
    .then(response => response.json());
  }
  fetch(url: string, params: any = {}) {
    let client = new HttpClient();
    let obj = localStorage.getItem('auth_token');
    url = host + url;
    console.log(obj);
    if(obj) {
      let token = JSON.parse(obj).access_token;
      if(!params.headers) {
        params.headers = {};
      }
      params.headers.Authorization = 'Bearer ' + token;
      return client.fetch(url, params);
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }
}
