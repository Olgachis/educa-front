import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';

function buildMap(obj) {
  return Object.keys(obj).reduce((map, key) => map.set(key, obj[key]), new Map());
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
    const evaluation = await api.fetch('/api/qualityEvaluation');
    this.evaluation = await evaluation.json();
    for(var kd in this.evaluation.dimensions) {
      var dimension = this.evaluation.dimensions[kd];
      dimension.subdimensions = buildMap(dimension.subdimensions);
    }
    this.dimensions = buildMap(this.evaluation.dimensions);
  }

  @computedFrom('selectedDimension.questions')
  get totalProperties() {
    return this.selectedDimension && this.selectedDimension.questions.length;
  }

  get answeredQuestions() {
    return this.selectedDimension && this.selectedDimension.questions.filter((question)=>question.value).length;
  }

  countAnswers(dimension) {
    return dimension.questions.filter((question)=>question.value).length;
  }

  showQuestionnaire(dimension) {
    this.questionnaireEnabled = true;
    this.selectedDimension = dimension;
    console.log(dimension);
  }

  hideQuestionnaire() {
    this.selectedDimension = null;
    this.questionnaireEnabled = false;
  }

  async saveQuestionnaire() {
    let api = new Api();
    let response = api.fetch('/api/qualityEvaluation/' + this.selectedDimension.id.number, {
      method: 'post',
      body: json(this.selectedDimension)
    });
    await response;
    const evaluation = await api.fetch('/api/qualityEvaluation');
    this.evaluation = await evaluation.json();
    for(var kd in this.evaluation.dimensions) {
      var dimension = this.evaluation.dimensions[kd];
      dimension.subdimensions = buildMap(dimension.subdimensions);
    }
    this.dimensions = buildMap(this.evaluation.dimensions);

    this.selectedDimension = null;
    this.questionnaireEnabled = false;
  }

}
