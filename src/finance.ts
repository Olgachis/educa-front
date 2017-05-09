import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';

@inject(AureliaConfiguration)
export class Finance {
  private config;
  private api;
  private listEnabled;
  private questionnaires;
  private responses;
  private selectedQuestionnaire;
  private questionnaireEnabled;
  private questionMap;
  private selectedQuestionnaireId;


  constructor(config) {
    this.config = config;
    this.api = new Api(this.config);

  }

  async activate(): Promise<void> {
    await fetch;
    const questionnaires = await this.api.fetch('/api/simpleQuestionnaire/list');
    this.questionnaires = await questionnaires.json();
  }

  async showQuestionnaireList(questionnaire) {

    this.listEnabled = true;
    this.questionnaireEnabled = false;
    this.selectedQuestionnaire = questionnaire;

    let selectedQuestionnaireId = this.selectedQuestionnaire.id;

    let modifyQuestionsSecondary: any[] = [
      {id: 'whatsANeed', "options": ["Cosas que quiero, pero puedo esperar para comprarlas.","Algo sin lo que la vida sería muy difícil.","No lo sé."]},
      {id: 'iSaveOtherMoney', "options": ["Otra, ¿cuál?"]},
      {id: 'whenCreateBudget', "options": ["Siempre","De manera frecuente","Muy poco","No elaboro un presupuesto","No me parece necesario"]}
    ];

    let modifyQuestionsSixt: any[] = [
      {id: 'howManyTimes', "options":["Siempre","Algunas veces","Pocas veces","Nunca","No tengo meta de ahorro"]}
    ];
    _.each(this.selectedQuestionnaire.questionnaire.questions, function (el) {
      if(selectedQuestionnaireId == 'secondary-students'){
        let nuevasOpciones = _.find(modifyQuestionsSecondary, function(o) { return o.id == el['id'] ; });
        if(nuevasOpciones){
          el['options'] = nuevasOpciones.options;
        }
        if(el['id'] == 'iSaveOtherMoney'){
          el['type'] = 'options';
        }
        if(el['id'] == 'savingInstitutions'){
          el['displayName'] = "¿Cuáles de las siguientes opciones son ejemplos de una institución financiera?";
        }
      }else if(selectedQuestionnaireId == 'sixth'){

        let nuevasOpciones = _.find(modifyQuestionsSixt, function(o) { return o.id == el['id'] ; });
        if(nuevasOpciones){
          el['options'] = nuevasOpciones.options;
        }
        if(el['id'] == 'whereSaveMoney'){
          el['type'] = 'multioptions';
        }
        if(el['id'] == 'wantToLearn'){
          el['type'] = 'multioptions';
        }
      }
    });

    console.log(questionnaire);
    const responses = await this.api.fetch('/api/simpleQuestionnaire/' + questionnaire.id + '/responses');
    this.responses = await responses.json();
  }

  showQuestionnaire(questionnaire) {

    this.listEnabled = false;
    this.questionnaireEnabled = true;
    questionnaire.questionnaire.questions.forEach((question) => {
      if(question.options) {
        question.options = question.options.map((o) => {
          if(typeof(o) == 'string') {
            return {
              name: o
            };
          } else {
            return o;
          }
        });
      }
    });
    this.selectedQuestionnaire = questionnaire;

    window.scrollTo(0, 0);
  }

  async saveQuestionnaire() {
    Utils.showSpinner();
    console.log(this.selectedQuestionnaire);
    let response = this.api.fetch('/api/simpleQuestionnaire', {
      method: 'post',
      body: json(this.selectedQuestionnaire)
    });
    let result = await response;
    const questionnaires = await this.api.fetch('/api/simpleQuestionnaire/list');
    const currentQuestionnaire = this.selectedQuestionnaire.id;
    this.questionnaires = await questionnaires.json();
    this.hideQuestionnaire();
    this.selectedQuestionnaire = this.questionnaires.questionnaires.filter((q) => {
      return currentQuestionnaire == q.id;
    })[0];



    this.showQuestionnaireList(this.selectedQuestionnaire);
    Utils.hideSpinner();
  }

  async loadQuestionnaire(res) {
    this.questionnaireEnabled = true;
    this.listEnabled = false;
    const questionnaire = await this.api.fetch('/api/simpleQuestionnaire/responses/' + res.id);
    const fullQuestionnaire = await questionnaire.json();
    this.selectedQuestionnaire.responseId = res.id;
    this.selectedQuestionnaire.questionnaire = fullQuestionnaire.data;

    let selectedQuestionnaireId = this.selectedQuestionnaire.id;

    let modifyQuestionsSecondary: any[] = [
      {id: 'whatsANeed', "options": ["Cosas que quiero, pero puedo esperar para comprarlas.","Algo sin lo que la vida sería muy difícil.","No lo sé."]},
      {id: 'iSaveOtherMoney', "options": ["Otra, ¿cuál?"]},
      {id: 'whenCreateBudget', "options": ["Siempre","De manera frecuente","Muy poco","No elaboro un presupuesto","No me parece necesario"]}
    ];

    let modifyQuestionsSixt: any[] = [
      {id: 'howManyTimes', "options":["Siempre","Algunas veces","Una vez","Nunca","No tengo meta de ahorro"]}
    ];
    _.each(this.selectedQuestionnaire.questionnaire.questions, function (el) {
      if(selectedQuestionnaireId == 'secondary-students'){
        let nuevasOpciones = _.find(modifyQuestionsSecondary, function(o) { return o.id == el['id'] ; });
        if(nuevasOpciones){
          let i = 0;
          _.each(el.options, function (opt) {
            opt.name = nuevasOpciones.options[i];
            i++;
          });
        }
        if(el['id'] == 'iSaveOtherMoney'){
          el['type'] = 'options';
        }
        if(el['id'] == 'savingInstitutions'){
          el['displayName'] = "¿Cuáles de las siguientes opciones son ejemplos de una institución financiera?";
        }
      }else if(selectedQuestionnaireId == 'sixth'){

        let nuevasOpciones = _.find(modifyQuestionsSecondary, function(o) { return o.id == el['id'] ; });
        if(nuevasOpciones){
          let i = 0;
          _.each(el.options, function (opt) {
            opt.name = nuevasOpciones.options[i];
            i++;
          });
        }
        if(el['id'] == 'whereSaveMoney'){
          el['type'] = 'multioptions';
        }
        if(el['id'] == 'wantToLearn'){
          el['type'] = 'multioptions';
        }
      }
    });
  }

  hideQuestionnaireList() {
    this.questionnaireEnabled = false;
    this.listEnabled = false;
    this.selectedQuestionnaire = null;
    window.scrollTo(0, 0);
  }

  hideQuestionnaire() {
    this.questionnaireEnabled = false;
    this.listEnabled = true;
    window.scrollTo(0, 0);
  }


}
