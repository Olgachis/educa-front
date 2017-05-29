import {inject} from 'aurelia-framework';

import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient, json} from 'aurelia-fetch-client';

import {Api} from './api';
import {Utils} from './utils';

import * as _ from 'lodash';
import * as nv from 'nvd3';
import * as d3 from 'd3';

function innerCreateDataChart(idGrafica, responses){
    //console.log('innerCreateDataChart', idGrafica);
    var question1 = new Array();
    _.forEach(responses, function(value) {
      let questions = value.data.questions;
      question1.push(questions[idGrafica]);
    });

    let datos = _.groupBy(question1, 'value');
    var testdata = new Array();
    _.forEach(datos, function(value, key) {
      testdata.push({key:key, y:value.length});
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
          var selectGrafica = '#test' + idGrafica;
          //console.log('selectGrafica', selectGrafica);
          d3.select(selectGrafica)
              .datum(testdata)
              .transition().duration(1200)
              .attr('width', width)
              .attr('height', height)
              .call(chart);

      return chart;
    });
  };

function innerCreateDataBarChart(idGrafica, responses){
  console.log('innerCreateDataBarChart', idGrafica);
    var optionsQuestionM = new Array();
    var values = new Array();

    _.forEach(responses, function(value) {
      let questions = value.data.questions;
      optionsQuestionM.push(questions[idGrafica].options);
    });

    optionsQuestionM = _.flattenDeep(optionsQuestionM);
    let mapOptions = _.groupBy(optionsQuestionM, 'name');
    _.forEach(mapOptions, function(value, key) {
      var total = _.countBy(value, 'value');
      values.push({label:key, value:total['true']});
    });

    var historicalBarChart = new Array();
    historicalBarChart.push({key:"idGrafica", values});

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .width(560)
            .staggerLabels(true)
            .staggerLabels(historicalBarChart[0].values.length > 8)
            .showValues(true)
            .duration(250)
            .margin({bottom: 250});

            chart.xAxis.rotateLabels(-90);
            chart.yAxis.tickFormat(d3.format(',.3f'));
        var selectGrafica = '#chart' + idGrafica + ' svg';
        console.log(selectGrafica);
        d3.select(selectGrafica)
            .datum(historicalBarChart)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    });
  }


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
  private estructura = new Array();

  constructor(config) {
    this.config = config;
    this.api = new Api(this.config);
    this.showQuestionnaireList();
  }

  async showQuestionnaireList() {
    await fetch;
    const questionnaires = await this.api.fetch('/api/simpleQuestionnaire/list');
    this.questionnaires = await questionnaires.json();
  }

  async showQuestionnaireDetail(questionnaire) {
    this.listEnabled = true;
    this.questionnaireEnabled = false;
    this.selectedQuestionnaire = questionnaire;

    let selectedQuestionnaireId = this.selectedQuestionnaire.id;
    var index = 0;

    const responses = await this.api.fetch('/api/simpleQuestionnaire/' + questionnaire.id + '/listFullResponses');
    this.responses = await responses.json().then(data => {
      this.responses = data.responses;
      _.forEach(this.selectedQuestionnaire.questionnaire.questions, function(value) {
        console.log(index);
        if(value.type == "options" || value.type == "text") {
          innerCreateDataChart(index, data.responses);
        } if (value.type == "multioptions") {
          innerCreateDataBarChart(index, data.responses);
        }
        index++;
      });
    });
  }

  demoCreateDataChart(){
     var question1 = new Array();
     var question2 = new Array();
     var question3 = new Array();
     var listaQuestions = new Array();
     var optionsQuestionM = new Array();

    _.forEach(this.responses.responses, function(value) {
      let questions = value.data.questions;
      //console.log('q', value.data);
      question1.push(questions[0]);
      question2.push(questions[8]);
      question3.push(questions[7]);
      optionsQuestionM.push(questions[7].options);
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

    var values = new Array();
    optionsQuestionM = _.flattenDeep(optionsQuestionM);
    let mapOptions = _.groupBy(optionsQuestionM, 'name');
    _.forEach(mapOptions, function(value, key) {
      var total = _.countBy(value, 'value');
      values.push({label:key, value:total['true']});
    });

    var historicalBarChart2 = new Array();
    historicalBarChart2.push({key:"gola", values});

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .width(560)
            .staggerLabels(true)
            .staggerLabels(historicalBarChart2[0].values.length > 8)
            .showValues(true)
            .duration(250)
            .margin({bottom: 250});

            chart.xAxis.rotateLabels(-90);
            chart.yAxis.tickFormat(d3.format(',.3f'));
        d3.select('#chart1 svg')
            .datum(historicalBarChart2)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    });

  }


}
