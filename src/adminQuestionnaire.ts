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
    this.activate();
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

  async saveQuestionnaire(): Promise<void> {
    await fetch;
    this.api = new Api(this.config);
    Utils.showSpinner();
    const response = await this.api.fetch('/api/questionnaire', {
      method: 'post',
      body: json(this.questionnaire)
    });
    await response.json().then(data => {
      this.questionnaire = data;
      console.log(this.questionnaire);
      Utils.hideSpinner();
    });

  }

  saveEditQuestion(questionData){
    console.log('saveEditQuestion', questionData);
    let recoverQuestion = _.find(this.question.options, function(o) { return o == questionData; });
    _.replace(this.question.options, this.identity, questionData);
    this.saveQuestionnaire();
    this.showDetailQuestion = false;
    this.question = null;
    this.identity = null;
  }

  addQuestion(){
    this.questionnaire.questionnaire.questions.push(this.question);
    this.showDetailQuestion = false;
    this.saveQuestionnaire();
    this.question = null;
  }

  deleteQuestion(questionData){
    let optionIndex = _.findIndex(this.questionnaire.questionnaire.questions, function(o) { return o == questionData; });
    this.questionnaire.questionnaire.questions.splice(optionIndex,1);
    this.saveQuestionnaire();
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

  //Subir bajar etapas
  subirEtapa = function (stage) {
    var indice = _.indexOf(this.questionnaire.questionnaire.questions, stage);
    if (indice > 0){
      this.cambiarEtapa(indice, indice-1);
    }
  };

  bajarEtapa = function (stage) {
    var indice = _.indexOf(this.questionnaire.questionnaire.questions, stage);
    if (indice!==-1 && indice < this.questionnaire.questionnaire.questions.length-1){
      this.cambiarEtapa(indice, indice + 1);
    }
  };

  cambiarEtapa = function (num1, num2) {
    var itemTem = this.questionnaire.questionnaire.questions[num1];
    var item2 = this.questionnaire.questionnaire.questions[num2];
    //Actualizando datos
    this.questionnaire.questionnaire.questions[num1] = item2;
    this.questionnaire.questionnaire.questions[num2] = itemTem;

    this.saveQuestionnaire();
  }
}
