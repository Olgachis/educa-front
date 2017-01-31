//import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Api} from './api';
import {Utils} from './utils';
import {AureliaConfiguration} from 'aurelia-configuration';

@inject(AureliaConfiguration)
export class Admin {
  private config;
  private api;
  private results;
  private summary;

  constructor(config) {
    this.config = config;
  }

  processColor(d) {
    let score = d.points / d.maxPoints;
    if(score < 0.55) {
      return '#C3002F';
    } else if(score < 0.7) {
      return '#BDA831';
    } else if(score < 0.85) {
      return '#3FAE49';
    } else {
      return '#365E9E';
    }
  }

  processLabel(d) {
    let score = d.points / d.maxPoints;
    if(score < 0.55) {
      return 'Alto riesgo';
    } else if(score < 0.7) {
      return 'Inestable';
    } else if(score < 0.85) {
      return 'Estable';
    } else {
      return 'En consolidación';
    }
  }

  async activate(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const summary = await this.api.fetch('/api/summary/list');
    this.summary = (await summary.json()).map(r => {
      r.canComplete = r.questions == r.maxQuestions;
      r.completed = (r.questions == r.maxQuestions) && !r.openQuestionnaire;
      r.score = (r.points / r.maxPoints * 100).toFixed(3);
      r.level = this.processLabel(r);
      r.missingQuestions = r.maxQuestions - r.questions;
      r.color = this.processColor(r);
      return r;
    });
    Utils.hideSpinner();
  }

  async openSelfAssessment(i) {
    Utils.showSpinner();
    await this.api.fetch('/api/summary/open/' + i.institutionId);
    i.completed = false;
    Utils.hideSpinner();
  }

  async closeSelfAssessment(i) {
    Utils.showSpinner();
    await this.api.fetch('/api/summary/close/' + i.institutionId);
    i.completed = true;
    Utils.hideSpinner();
  }

}


