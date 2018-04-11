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

  transformCoso(el ){
    return {
      id: el['id'].number,
      name: el['id'].name,
      maxPoints: el['maxPoints'],
      maxQuestions: el['maxPoints'],
      minimumRequiredQuestions: el['maxPoints'],
      points: el['points'],
      score: (el['points'] / el['maxPoints'] * 100).toFixed(1)
    };
  }

  processInnerCampus(innerCampus){
    return innerCampus.map(r => {

      r = r.questionnaireResults;

      r.institutionName = r.institutionName;
      r.color = this.processColor(r);
      r.score = (r.points / r.maxPoints * 100).toFixed(3);
      r.level = this.processLabel(r);
      r.completed = (r.questions == r.maxQuestions) && !r.openQuestionnaire;
      r.dimensions = _.map(r.dimensionResults, this.transformCoso);
      return r;
    });
  }

  async activate(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const summary = await this.api.fetch('/api/summary/listPrimaryCampuses');
    this.summary = (await summary.json()).map(r => {
      let innerCampus, name, showDetail;

      if(r.innerCampus.length > 1){
        innerCampus = this.processInnerCampus(r.innerCampus);
        showDetail = true;
      }else{
        showDetail = false;
      }

      name = r.name;
      r = r.questionnaireResults;
      r.showDetail = showDetail;

      let dimensions = _.map(r.dimensionResults, this.transformCoso);

      r.canComplete = r.questions == r.maxQuestions;
      r.completed = (r.questions == r.maxQuestions) && !r.openQuestionnaire;
      r.score = (r.points / r.maxPoints * 100).toFixed(3);
      r.level = this.processLabel(r);
      r.missingQuestions = r.maxQuestions - r.questions;
      r.color = this.processColor(r);
      r.dimensions = dimensions;
      r.innerCampus = innerCampus;
      r.showDetail = false;

      r.name = name;
      return r;
    });
    Utils.hideSpinner();
  }

  showDetail(i){
    i.showDetail = !i.showDetail;
  }
}