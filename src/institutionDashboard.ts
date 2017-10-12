import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

@inject(AureliaConfiguration)
export class InstitutionDashboard {
  public me;
  private router;
  private config;

  constructor(config) {
    this.config = config;
  }

  async activate(): Promise<void> {

    await fetch;
    let api = new Api(this.config);
    const me = await api.fetch('/api/me');
    this.me = await me.json();

  }

  showDimensions(){
    this.router.navigate('dimensions');
  }

}
