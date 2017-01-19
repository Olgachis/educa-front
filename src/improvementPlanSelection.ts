import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

@inject(AureliaConfiguration)
export class ImprovementPlanSelection {

  private config;
  public minQuestions;
  public plan;

  public priorityOptions = [
    1,
    2,
    3
  ];

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
    this.minQuestions = Math.ceil(this.plan.questions.length / 4);
  }

  get selectedQuestions() {
    return this.plan.questions.filter((q) => {
      return q.selected;
    }).length;
  }

  @computedFrom('selectedDimension.questions')
  get totalPoints() {
    return this.plan.questions.map((q) => {
      return q.priority;
    }).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }

  get selectedPoints() {
    return this.plan.questions.filter((q) => {
      return q.selected;
    }).map((q) => {
      return q.priority;
    }).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
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
      location.href = '/#/improvementPlanDefinition';
    }
  }

}


