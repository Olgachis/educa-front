import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

@inject(AureliaConfiguration)
export class ImprovementPlanDefinition {

  private config;
  public minQuestions;
  public plan;
  public questions;

  constructor(config) {
    this.config = config;
  }

  async activate(): Promise<void> {
    await fetch;
    await this.fetchData();
  }

  async fetchData() {
    let api = new Api(this.config);
    const plan = await api.fetch('/api/qualityEvaluation/improvementPlan');
    this.plan = await plan.json();
    this.questions = this.plan.questions.filter((q) => {
      return q.selected;
    });
  }

  async saveData() {
    Utils.showSpinner();
    let api = new Api(this.config);
    let plan = JSON.parse(JSON.stringify(this.plan));
    let response = api.fetch('/api/qualityEvaluation/improvementPlan', {
      method: 'post',
      body: json(plan)
    });
    let result = await response;
    Utils.hideSpinner();
    if(result.status === 200) {
      Utils.showModal('Los datos han sido guardados correctamente');
    }
  }

}



