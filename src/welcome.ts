//import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from './api';
import {Utils} from './utils';
import {AureliaConfiguration} from 'aurelia-configuration';

@inject(Router,AureliaConfiguration)
export class Welcome {
  public username;
  public password;
  private router;
  private config;
  private me;
  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')
  // get fullName(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }
  //
  constructor(router,config) {
    this.router = router;
    this.config = config;
  }

  async submit() {
    let api = new Api(this.config);
    console.log('Logging in', this.username);
    let data : any = await api.login(this.username, this.password);
    if(data.access_token) {
      localStorage.setItem('auth_token', JSON.stringify(data));
      const me = await api.fetch('/api/me');
      this.me = await me.json();
      if(this.me.role == 'admin') {
        this.router.navigate('admin');
      } else if(this.me.role == 'finance') {
        this.router.navigate('finance');
      } else {
        this.router.navigate('dimensions');
      }
    } else {
      //Handle error
      Utils.showModal('Nombre de usuario y/o password incorrectos, favor de verificar');
    }
  }

}

