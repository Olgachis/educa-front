//import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Api} from './api';
import {Utils} from './utils';
import {AureliaConfiguration} from 'aurelia-configuration';
import * as _ from 'lodash';

@inject(AureliaConfiguration)
export class Dashboard {
  private config;
  private api;
  private results;
  private summary;

  constructor(config) {
    this.config = config;
  }

  async activate(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const summary = await this.api.fetch('/api/summary/listPrimaryCampuses');
    Utils.hideSpinner();
  }
}
