import {HttpClient} from 'aurelia-fetch-client';

export class Api {
  private endpoint;

  constructor(config) {
    this.endpoint = config.get('api.endpoint');
  }
  refresh(refreshToken) {
    let client = new HttpClient();
    let data = new FormData() as any;
    data.set('refresh_token', refreshToken);
    data.set('grant_type', 'refresh_token');
    return client.fetch(this.endpoint + "/oauth/token", {
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
    return client.fetch(this.endpoint + "/oauth/token", {
      method: "POST",
      body: data,
      headers: {
        'Authorization': 'Basic ' + btoa('acme:acmesecret'),
      }
    })
    .then(response => response.json());
  }
  fetch(url: string, params: any = {}): Promise<Response> {
    let client = new HttpClient();
    let obj = localStorage.getItem('auth_token');
    url = this.endpoint + url;
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
