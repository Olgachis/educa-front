import {inject} from 'aurelia-framework';

import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';

import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';
@inject(AureliaConfiguration)
export class InstitutionList {
  private config;
  private api;
  private results;
  private showDetail = false;
  private institution;

  constructor(config) {
    this.config = config;
    this.api = new Api(this.config);
  }

  async activate(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const summary = await this.api.fetch('/api/institution/list');
    this.results = (await summary.json()).map(r => {
      console.log('r', r);

      return r;
    });
    Utils.hideSpinner();
  }

  showDetailFunc(institution){
    this.showDetail = true;
    this.institution = institution;
  }

  hideDetailFunc(institution){
    this.showDetail = false;
    this.institution = null;
  }
}
