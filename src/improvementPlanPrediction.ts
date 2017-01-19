import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

import * as nv from 'nvd3';
import * as d3 from 'd3';

function buildArray(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push(obj[key]);
    return arr;
  }, new Array());
}

@inject(AureliaConfiguration)
export class ImprovementPlan {

  private config;
  private evaluation;
  private results;
  private dimensions;
  private questions;
  public missingPoints;
  public yearlyPoints;
  public score;

  constructor(config) {
    this.config = config;
  }

  async activate(): Promise<void> {
    await fetch;
    await this.fetchData();
  }

  async fetchData() {
    let api = new Api(this.config);
    const evaluation = await api.fetch('/api/qualityEvaluation');
    this.evaluation = await evaluation.json();
    const results = await api.fetch('/api/qualityEvaluation/prediction');
    this.results = await results.json();
    this.score = (this.results.points / this.results.maxPoints * 100).toFixed(3);
    this.questions = new Array();
    let missingPoints = Math.ceil(this.results.maxQuestions) * 0.95 - this.results.maxCountingQuestions;
    let yearlyPoints = Math.ceil(missingPoints / 4.0);
    for(var kd in this.evaluation.dimensions) {
      var dimension = this.evaluation.dimensions[kd];
      dimension.subdimensions = buildArray(dimension.subdimensions);
      dimension.subdimensions.sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
    }
    this.dimensions = buildArray(this.evaluation.dimensions);
    let candidates = new Array();
    var i = 0;
    for(var kd in this.dimensions) {
      var dimension = this.dimensions[kd];
      for(var ks in dimension.subdimensions) {
        var subdimension = dimension.subdimensions[ks];
        for(var kq in subdimension.questions) {
          var question = subdimension.questions[kq];
          question.num = ++i;
          if(!question.valuable) {
            candidates.push({
              question: question,
              dimension: dimension,
              subdimension: subdimension
            });
          }
        }
      }
    }
    candidates.sort((a, b) => {
      return (-a.question.priority) - (-b.question.priority);
    });
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });

    this.missingPoints = missingPoints;
    this.yearlyPoints = yearlyPoints;

    var currentIdx = 0;
    var totalPoints = this.results.points;
    var currentCopy = this.copyResults(this.results.dimensionResults);
    for(var i = 1; i <= 4; i++) {
      let copy = this.copyResults(currentCopy);
      var currentPoints = 0;
      var currentQuestions = new Array();
      while(currentPoints < yearlyPoints) {
        let q = candidates[currentIdx];
        if(!q) break;
        if(q.question.options) {
          var label = '(';
          for(var j = 0; j < q.question.options.length; j++) {
            label += q.question.options[j].name;
            if(j < q.question.options.length - 1) {
              label += ', ';
            }
          }
          label += ')';
          q.question.question += ' ' + label;
        }
        copy[q.dimension.id.number].points += q.question.priority;
        currentQuestions.push(q);
        currentPoints += 1;
        totalPoints += q.question.priority;
        currentIdx++;
      }
      currentQuestions.sort((a,b) => {
        return a.question.num - b.question.num;
      });
      this.questions.push({
        period: i,
        score: (totalPoints / this.results.maxPoints * 100).toFixed(3),
        dimensionResults: copy,
        questions: currentQuestions
      });
      currentCopy = this.copyResults(copy);
    }

  }

  copyResults(results) {
    let data = new Array();
    for(var k in results) {
      let datum = results[k]
      data[k] = {
        id: datum.id,
        maxPoints: datum.maxPoints,
        points: datum.points
      };
    }
    return data;
  }

  plotPeriods() {
    this.questions.forEach((p) => {
      this.drawDimension(p);
    });
  }

  drawDimension(dimension) {
    let data = new Array();
    for(var k in dimension.dimensionResults) {
      var s = dimension.dimensionResults[k];
      data.push({
        label: s.id.name,
        value: s.points / s.maxPoints
      });
    }
    nv.addGraph(() => {
      let chart = nv.models.discreteBarChart()
        .x((d) => { return d.label; })
        .y((d) => { return d.value; })
        .yDomain([0, 1])
        .color((d) => { return this.processColor(d); })
        .margin({bottom: 250});

      chart.xAxis.rotateLabels(-90);
      chart.yAxis.tickFormat(d3.format(',.3f'));

      d3.select(`#period-${dimension.period} svg`)
        .datum([
          {
            key: 'Puntaje',
            values: data
          }
        ])
        .call(chart);

      nv.utils.windowResize(chart.update);
      this.drawLine(`#period-${dimension.period}`, chart, 0.55, '#BDA831');
      this.drawLine(`#period-${dimension.period}`, chart, 0.7, '#3FAE49');
      this.drawLine(`#period-${dimension.period}`, chart, 0.85, '#365E9E');

      return chart;
    });
  }

  attached() {
    this.drawDimension({
      period: 0,
      dimensionResults: this.results.dimensionResults
    });
    this.plotPeriods();
  }

	drawLine(graph, chart, yValue, color) {
    var yValueScale = chart.yAxis.scale();
    var xValueScale = chart.xAxis.scale();
    var g = d3.select(graph + ' svg .nvd3');
    g.append("line")
      .style("stroke", color)
      .style("stroke-width", "2.5px")
      .attr("x1", 60)
      .attr("y1", yValueScale(yValue))
      .attr("x2", 1000)
      .attr("y2", yValueScale(yValue));
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

}


