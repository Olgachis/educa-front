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
  private identity;
  private showEditQuestion = false;

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
      this.questionnaire = {name: "nuevoCuestionario", questionnaire : {text:"", questions:[]}};
    }else if(type == 'edit'){
      this.questionnaire = questionnaireData;
    }
  }

  cleanVariables(){
    this.questionnaire = null;
    this.question = null;
    this.option = null;
    this.showDetailQuestion = false;
  }

  hideDetailFunc(questionnaireData){
    this.showDetail = false;
    this.cleanVariables();
  }

  showDetailQuestionFunc(questionData){
    console.log('showDetailQuestionFunc', questionData);
    this.showDetailQuestion = true;
    if(questionData){
      this.question = questionData;
    }else{
      this.question = {type:'text', options:[]};
    }
    this.option = {type:'text', name:null};
  }

  editQuestion(questionData){
    console.log('editQuestion', questionData);
    this.showDetailQuestion = true;
    this.showEditQuestion = true;
    if(questionData){
      this.question = questionData;
    }else{
      this.question = {type:'text', options:[]};
    }
    this.option = {type:'text', name:null};
    this.identity = {id : questionData.id }
    this.question.edit = true;
  }

  cancelCreateQuestionnaire(questionnaireData){
    this.showNewQuestionnaire = false;
    this.cleanVariables();
  }

  async createQuestionnaire(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const response = await this.api.fetch('/api/questionnaire', {
      method: 'post',
      body: json(this.questionnaire)
    });
    this.questionnaire = (await response.json());
    console.log(this.questionnaire);
    Utils.hideSpinner();
  }

  saveEditQuestion(questionData){
    console.log('saveEditQuestion', questionData);
    let recoverQuestion = _.find(this.question.options, function(o) { return o == questionData; });
    _.replace(this.question.options, this.identity, questionData);
    this.showDetailQuestion = false;
    this.question = null;
    this.identity = null;
  }

  addQuestion(){
    this.questionnaire.questionnaire.questions.push(this.question);
    this.showDetailQuestion = false;
    this.question = null;
  }

  addOptionQuestion(optionData){
    console.log('optionData', optionData);
    if(optionData.type == 'text'){
      this.question.options.push(optionData.name);
    }else if(optionData.type == 'otro'){
      this.question.options.push({name:optionData.name, other:true });
    }
    this.option.name = null;
  }

  deleteOptionQuestion(optionData){
    let optionIndex = _.findIndex(this.question.options, function(o) { return o == optionData; });
    this.question.options.splice(optionIndex,1);
  }

  cancelQuestion(){
    this.question = null;
    this.option = null;
    this.showDetailQuestion = false;
  }

  optionTypeQuestion(optionData) {
    if(optionData.type == 'text'){
      this.question.options = [];
    }
  }

  private replace(collection, identity, replacement){
    var index = _.indexOf(collection, _.find(collection, identity));
    collection.splice(index, 1, replacement);
  }
}
