import {HttpClient} from 'aurelia-fetch-client';

let host = "http://localhost:8080"

export class Api {
  refresh(refreshToken) {
    let client = new HttpClient();
    let data = new FormData() as any;
    data.set('refresh_token', refreshToken);
    data.set('grant_type', 'refresh_token');
    return client.fetch(host + "/oauth/token", {
      method: "POST",
      body: data,
      headers: {
        'Authorization': 'Basic ' + btoa('acme:acmesecret'),
      }
    })
    .then(response => response.json());
  }
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
    if(obj) {
      let jsonData = JSON.parse(obj);
      let token = jsonData.access_token;
      if(!params.headers) {
        params.headers = {};
      }
      params.headers.Authorization = 'Bearer ' + token;
      return client.fetch(url, params).then((data) => {
        if(data.status === 401) {
          return this.refresh(jsonData.refresh_token)
            .then((authData: any) => {
              params.headers.Authorization = 'Bearer ' + authData.access_token;
              localStorage.setItem('auth_token', JSON.stringify(authData));
              return client.fetch(url, params);
            });
        } else {
          return data;
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }
}
