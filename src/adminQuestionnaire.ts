import {inject} from 'aurelia-framework';

import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';

import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';
@inject(AureliaConfiguration)
export class AdminQuestionnaire {
  private config;
  private api;
  private questionnaires;
  private questionnaire;
  private question;
  private option;
  private showDetail = false;
  private showDetailQuestion = false;
  private showNewQuestionnaire = false;

  constructor(config) {
    this.config = config;
    this.api = new Api(this.config);
  }

  async activate(): Promise<void> {
    await fetch;
    const questionnaires = await this.api.fetch('/api/simpleQuestionnaire/list');
    this.questionnaires = await questionnaires.json();
  }

  showDetailFunc(questionnaireData, type){
    this.showDetail = true;
    console.log(questionnaireData, type);
    if(type == 'create'){
      this.questionnaire = {id: "nuevoCuestionario", name: "nuevoCuestionario"};
    }else if(type == 'edit'){
      this.questionnaire = questionnaireData;
    }

  }

  hideDetailFunc(questionnaireData){
    this.showDetail = false;
    this.questionnaire = null;
  }

  showDetailQuestionFunc(questionData){
    this.showDetailQuestion = true;
    this.question = questionData;
    this.option = {type:'text'};
    console.log(questionData);
  }

  cancelCreateQuestionnaire(questionnaireData){
      this.showNewQuestionnaire = false;
      this.questionnaire = null;
  }

  async createQuestionnaire() {
    Utils.showSpinner();

    console.log("createQuestionnaire", this.questionnaire);
    let response = this.api.fetch('/api/questionnaire', {
      method: 'post',
      body: json(this.questionnaire)
    });
    let result = await response;
    Utils.hideSpinner();
  }

}
