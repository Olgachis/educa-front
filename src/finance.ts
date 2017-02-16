import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

@inject(AureliaConfiguration)
export class Finance {
  private config;
  private api;
  private listEnabled;
  private questionnaires;
  private responses;
  private selectedQuestionnaire;
  private questionnaireEnabled;

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
    console.log(this.selectedQuestionnaire);
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

