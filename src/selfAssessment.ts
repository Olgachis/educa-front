import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

import * as nv from 'nvd3';
import * as d3 from 'd3';

import * as jQuery from 'jquery';
let $ = jQuery as any;

function buildArray(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push(obj[key]);
    return arr;
  }, new Array());
}

@inject(AureliaConfiguration)
export class SelfAssessment {
  private config;
  private evaluation;
  private averageEvaluation;
  private dimensions;


  private allCharts;
  
  public score;
  public averageScore;

  constructor(config) {
    this.config = config;
  }

  processColor(value) {
    let score = value.value;
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

  drawDimension(dimension) {
    let data = new Array();
    for(var k in dimension.subdimensionResults) {
      var s = dimension.subdimensionResults[k];
      data.push({
        label: s.id.name,
        value: s.points / s.maxPoints
      });
    }
    nv.addGraph(() => {
      let chart = nv.models.discreteBarChart()
        .x((d) => { return d.label; })
        .y((d) => { return d.value; })
        .width(560)
        .height(500)
        .yDomain([0, 1])
        .color((d) => { return this.processColor(d); })
        .forceY([0,1])
        .margin({bottom: 200});

      chart.xAxis.rotateLabels(-90);
      chart.yAxis.tickFormat(d3.format(',.3f'));

      d3.select(`#sub-${dimension.id.number} svg`)
        .datum([
          {
            key: 'Puntaje',
            values: data
          }
        ])
        .call(chart);

      this.drawLine(`#sub-${dimension.id.number}`, chart, 0.55, '#BDA831', 'Inestable');
      this.drawLine(`#sub-${dimension.id.number}`, chart, 0.7, '#3FAE49', 'Estable');
      this.drawLine(`#sub-${dimension.id.number}`, chart, 0.85, '#365E9E', 'En Consolidación');
      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

	drawLine(graph, chart, yValue, color, text) {
    var yValueScale = chart.yAxis.scale();
    var g = d3.select(graph + ' svg .nvd3');
    let scale = yValueScale(yValue - 0.04);

    g.append("text")
      .attr("fill", color)
      .attr("x", 560)
      .attr("y", scale)
      .text(text);

    g.append("line")
      .style("stroke", color)
      .style("stroke-width", "2.5px")
      .attr("x1", 60)
      .attr("y1", scale)
      .attr("x2", 560)
      .attr("y2", scale);
	}

  showDimensions(evaluation) {
    let data = new Array();
    for(var k in evaluation.dimensionResults) {
      var dimension = evaluation.dimensionResults[k];
      data.push({
        label: dimension.id.name,
        value: dimension.points / dimension.maxPoints
      });
    }

    nv.addGraph(() => {
      let chart = nv.models.discreteBarChart()
        .x((d) => { return d.label; })
        .y((d) => { return d.value; })
        .width(560)
        .height(400)
        .yDomain([0, 1])
        .color((d) => { return this.processColor(d); })
        .forceY([0,1])
        .margin({bottom: 150});

      chart.xAxis.rotateLabels(-90);
      chart.yAxis.tickFormat(d3.format(',.3f'));

      d3.select('#dimensionsChart svg')
        .datum([
          {
            key: 'Puntaje',
            values: data
          }
        ])
        .call(chart);

      this.drawLine('#dimensionsChart', chart, 0.55, '#BDA831', 'Inestable');
      this.drawLine('#dimensionsChart', chart, 0.7, '#3FAE49', 'Estable');
      this.drawLine('#dimensionsChart', chart, 0.85, '#365E9E', 'En Consolidación');
      nv.utils.windowResize(chart.update);


      return chart;
    });
  }

  showLevel(evaluation, averageEvaluation) {
    let score = (evaluation.points / evaluation.maxPoints * 100).toFixed(3);
    let averageScore = (averageEvaluation.points / averageEvaluation.maxPoints * 100).toFixed(3);
    this.score = score;
    this.averageScore = averageScore;
    let data = {
      "title":"Resultado",
      "subtitle":"EDUCA",
      "ranges":[55,70,85,100],
      "rangeLabels":['Alto riesgo','Inestable','Estable','En consolidación'],
      "measures":[score],
      "markers":[70, averageScore],
      "markerLabels": ['Mínimo', 'Promedio Red EDUCA'],
      "measureLabels": ['Nivel de madurez EDUCA']
    };
    nv.addGraph(() => {
      let chart = nv.models.bulletChart();
      d3.select('#levelChart svg')
        .datum(data)
        .transition().duration(1000)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

  round(num) {
    return Math.ceil(num);
  }

  calcScore(d) {
    return (d.points / d.maxPoints).toFixed(3);
  }

  prepareCharts(evaluation) {
    let allCharts = new Array();

    for(var kd in evaluation.dimensionResults) {
      var dimension = evaluation.dimensionResults[kd];
      allCharts.push(dimension);
    }

    this.allCharts = allCharts;
  }

  plotCharts() {
    this.allCharts.forEach((d) => {
      this.drawDimension(d);
    });
  }

  async activate(): Promise<void> {
    await fetch;
    await this.fetchData();
    await this.fetchAverageData();

    this.prepareCharts(this.evaluation);

    this.showLevel(this.evaluation, this.averageEvaluation);
    this.showDimensions(this.evaluation);
  }

  attached() {
    this.plotCharts();
  }

  async fetchAverageData() {
    let api = new Api(this.config);
    const evaluation = await api.fetch('/api/qualityEvaluation/averageResults');
    this.averageEvaluation = await evaluation.json();
  }

  async fetchData() {
    let api = new Api(this.config);
    const evaluation = await api.fetch('/api/qualityEvaluation/results');
    this.evaluation = await evaluation.json();
    var missingQuestions = this.evaluation.maxQuestions - this.evaluation.maxCountingQuestions;
    var years = 4.0;
    var yearlyQuestions = missingQuestions / years;
    var subdimensions = new Array();
    for(var kd in this.evaluation.dimensionResults) {
      var dimension = this.evaluation.dimensionResults[kd];
      dimension.subdimensions = buildArray(dimension.subdimensionResults);
      dimension.subdimensions.sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
      dimension.subdimensions.forEach((subdimension) => {
        subdimensions.push(subdimension);
      });
    }
    subdimensions.forEach((subdimension) => {
      var weight = 0;
      if(subdimension.maxCountingQuestions == subdimension.maxQuestions) {
        weight = -1;
      } else {
        weight = (subdimension.maxPoints - subdimension.points);
      }
      subdimension.weight = weight;
    });
    subdimensions.sort((a, b) => {
      return -a.weight - -b.weight;
    });
    var currentQuestions = 0;
    var currentPriority = 1;
    subdimensions.forEach((subdimension) => {
      subdimension.priority = currentPriority;
      subdimension.missingPoints = subdimension.maxPoints - subdimension.points;
      currentQuestions += subdimension.maxQuestions - subdimension.maxCountingQuestions;
      if(currentPriority < 3) {
        if(currentQuestions > yearlyQuestions) {
          subdimension.priority = subdimension.priority + 1;
        }
        if(currentQuestions >= yearlyQuestions) {
          currentPriority++;
          currentQuestions = 0;
        }
      }
    });
    this.dimensions = buildArray(this.evaluation.dimensionResults);
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });
  }

}
