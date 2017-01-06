import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

function buildArray(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push(obj[key]);
    return arr;
  }, new Array());
}

export class Dimensions {
  public me;
  public evaluation;
  public dimensions;
  public selectedDimension;
  public questionnaireEnabled;

  async activate(): Promise<void> {
    this.questionnaireEnabled = false;
    await fetch;
    let api = new Api();
    const me = await api.fetch('/api/me');
    this.me = await me.json();
    await this.fetchData();
  }

  @computedFrom('selectedDimension.questions')
  get totalProperties() {
    return this.selectedDimension && this.selectedDimension.questions && this.selectedDimension.questions.length;
  }

  get answeredQuestions() {
    return this.selectedDimension && this.selectedDimension.questions && this.selectedDimension.questions.filter((question)=>question.value).length;
  }

  countAnswers(dimension) {
    return dimension.questions.filter((question)=>question.value).length;
  }

  showQuestionnaire(dimension) {
    this.questionnaireEnabled = true;
    this.selectedDimension = dimension;
  }

  hideQuestionnaire() {
    this.selectedDimension = null;
    this.questionnaireEnabled = false;
  }

  async fetchData() {
    let api = new Api();
    const evaluation = await api.fetch('/api/qualityEvaluation');
    this.evaluation = await evaluation.json();
    for(var kd in this.evaluation.dimensions) {
      var dimension = this.evaluation.dimensions[kd];
      dimension.subdimensions = buildArray(dimension.subdimensions);
      dimension.subdimensions.sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
    }
    this.dimensions = buildArray(this.evaluation.dimensions);
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });
  }

  async saveQuestionnaire() {

    Utils.showSpinner();
    let api = new Api();
    let response = api.fetch('/api/qualityEvaluation/' + this.selectedDimension.id.number, {
      method: 'post',
      body: json(this.selectedDimension)
    });
    let result = await response;

    await this.fetchData();
    Utils.hideSpinner();
    if(result.status === 200) {
      let missing = this.totalProperties - this.answeredQuestions;
      Utils.showModal(`Datos guardados correctamente, faltan por contestar <strong>${missing}</strong> reactivos para <strong>${this.selectedDimension.id.number} ${this.selectedDimension.id.name}</strong>`);
    } else {
      Utils.showModal('Ocurrió un error al guardar los datos');
    }

    this.selectedDimension = null;
    this.questionnaireEnabled = false;
  }

}
