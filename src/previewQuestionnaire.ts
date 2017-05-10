import {inject} from 'aurelia-framework';

import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';

import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';
@inject(AureliaConfiguration)
export class PreviewQuestionnaire {
  private questionnaireId;
  private questionnaire;
  private config;
  private api;

  constructor(config) {
    this.config = config;
    this.api = new Api(this.config);
  }

  async activate(params): Promise<void> {
    console.log(params.id);
    this.questionnaireId = params.id;
    this.getQuestionnaire();
  }

  async getQuestionnaire() {
    const questionnaireData = await this.api.fetch('/api/questionnaire/getQuestionnaire/' + this.questionnaireId);
    const fullQuestionnaire = await questionnaireData.json();
    this.questionnaire = fullQuestionnaire;

    console.log(fullQuestionnaire);
  }
}
