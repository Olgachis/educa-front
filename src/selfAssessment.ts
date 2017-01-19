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

  private highRisk;
  private unstable;
  private stable;
  private consolidation;

  public score;
  public averageScore;

  constructor(config) {
    this.config = config;
  }

  processColor(value) {
    let score = value.value;
    if(score < 0.55) {
      return 'red';
    } else if(score < 0.7) {
      return 'orange';
    } else if(score < 0.85) {
      return 'green';
    } else {
      return 'purple';
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
        .color((d) => { return this.processColor(d); })
        .margin({bottom: 200});

      chart.xAxis.rotateLabels(-90);

      d3.select(`#sub-${dimension.id.number} svg`)
        .datum([
          {
            key: 'Puntaje',
            values: data
          }
        ])
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
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
        .color((d) => { return this.processColor(d); })
        .forceY([0,1])
        .margin({bottom: 200});

      chart.xAxis.rotateLabels(-90);

      d3.select('#dimensionsChart svg')
        .datum([
          {
            key: 'Puntaje',
            values: data
          }
        ])
        .call(chart);

      nv.utils.windowResize(chart.update);

      var g = d3.select('#dimensionsChart svg');

      var yValueScale = chart.yAxis.scale();

      g.append("line")
      .style("stroke", "#3FAE49")
      .style("stroke-width", "2.5px")
      .attr("x1", 70 )
      .attr("y1", yValueScale(.84))
      .attr("x2", 700)
      .attr("y2", yValueScale(.84));

      g.append("line")
      .style("stroke", "#BDA831")
      .style("stroke-width", "2.5px")
      .attr("x1", 70 )
      .attr("y1", yValueScale(.69))
      .attr("x2", 700)
      .attr("y2", yValueScale(.69));

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
    let highRisk = new Array();
    let unstable = new Array();
    let stable = new Array();
    let consolidation = new Array();

    for(var kd in evaluation.dimensionResults) {
      var dimension = evaluation.dimensionResults[kd];
      var score = dimension.points / dimension.maxPoints;
      if(score < 0.55) {
        highRisk.push(dimension);
      } else if(score < 0.7) {
        unstable.push(dimension);
      } else if(score < 0.85) {
        stable.push(dimension);
      } else {
        consolidation.push(dimension);
      }
    }

    this.highRisk = highRisk;
    this.unstable = unstable;
    this.stable = stable;
    this.consolidation = consolidation;


  }

  plotCharts() {
    this.consolidation.forEach((d) => {
      this.drawDimension(d);
    });
    this.stable.forEach((d) => {
      this.drawDimension(d);
    });
    this.unstable.forEach((d) => {
      this.drawDimension(d);
    });
    this.highRisk.forEach((d) => {
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
    for(var kd in this.evaluation.dimensionResults) {
      var dimension = this.evaluation.dimensionResults[kd];
      dimension.subdimensions = buildArray(dimension.subdimensionResults);
      dimension.subdimensions.sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
    }
    this.dimensions = buildArray(this.evaluation.dimensionResults);
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });
  }

}
