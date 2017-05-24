import {inject} from 'aurelia-framework';

import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';

import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';
import * as nv from 'nvd3';
import * as d3 from 'd3';

@inject(AureliaConfiguration)
export class EditQuestionnaire {

  private config;
  private api;
  private listEnabled;
  private questionnaires;
  private responses;
  private selectedQuestionnaire;
  private questionnaireEnabled;
  private questionMap;
  private selectedQuestionnaireId;
  private displayNameQ1;
  private displayNameQ2;
  private displayNameQ3;

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

    const responses = await this.api.fetch('/api/simpleQuestionnaire/' + questionnaire.id + '/listFullResponses');
    this.responses = await responses.json();

    this.createDataChart();
  }

  createDataChart(){
     var question1 = new Array();
     var question2 = new Array();
     var question3 = new Array();
    _.forEach(this.responses.responses, function(value) {
      let questions = value.data.questions;
      question1.push(questions[0]);
      question2.push(questions[8]);
      question3.push(questions[9]);

    });
    let datos = _.groupBy(question1, 'value');
    let datos2 = _.groupBy(question2, 'value');
    let datos3 = _.groupBy(question3, 'value');

    this.displayNameQ1 = question1[0].displayName;
    this.displayNameQ2 = question2[0].displayName;
    this.displayNameQ3 = question3[0].displayName;

    var testdata = new Array();
    var testdata2 = new Array();
    var testdata3 = new Array();

    _.forEach(datos, function(value, key) {
      testdata.push({key:key, y:value.length});
    });
    _.forEach(datos2, function(value, key) {
      testdata2.push({key:key, y:value.length});
    });
    _.forEach(datos3, function(value, key) {
      testdata3.push({key:key, y:value.length});
    });
    var height = 400;
    var width = 400;
    nv.addGraph(() => {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.y })
          .width(width)
          .labelThreshold(.05)
          .height(height);

          d3.select("#test1")
              .datum(testdata)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .call(chart);

      return chart;
    });
    nv.addGraph(() => {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.y })
          .width(width)
          .height(height);

          d3.select("#test2")
              .datum(testdata2)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .call(chart);

      return chart;
    });
    nv.addGraph(() => {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.y })
          .width(width)
          .labelThreshold(.05)
          .height(height);

          d3.select("#test3")
              .datum(testdata3)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .call(chart);

      return chart;
    });
  }


}
