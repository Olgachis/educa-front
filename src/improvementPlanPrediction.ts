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

  public plan;
  public plannedQuestions;
  private config;
  private evaluation;
  private results;
  private dimensions;
  private questions;
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
    const plan = await api.fetch('/api/qualityEvaluation/improvementPlan');
    this.plan = await plan.json();
    this.plannedQuestions = this.plan.questions.filter((q) => {
      return q.selected;
    });
    const evaluation = await api.fetch('/api/qualityEvaluation');
    this.evaluation = await evaluation.json();
    const results = await api.fetch('/api/qualityEvaluation/prediction');
    this.results = await results.json();
    this.score = (this.results.points / this.results.maxPoints * 100).toFixed(3);
    this.questions = new Array();
    let yearlyPoints = Math.floor((this.results.maxQuestions - this.results.maxCountingQuestions) / 3.0);
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
        var subdimensionResults = this.results.dimensionResults[dimension.id.number].subdimensionResults[subdimension.id.number];
        var weight = -1;
        if(subdimensionResults.maxCountingQuestions != subdimensionResults.maxQuestions) {
          weight = subdimensionResults.maxPoints - subdimensionResults.points;
        }
        for(var kq in subdimension.questions) {
          var question = subdimension.questions[kq];
          question.num = ++i;
          if(!question.valuable) {
            candidates.push({
              question: question,
              dimension: dimension,
              weight: weight,
              subdimension: subdimension
            });
          }
        }
      }
    }
    candidates.sort((a, b) => {
      return (b.question.priority * 1000 + b.weight * 10) - (a.question.priority * 1000 + a.weight * 10);
    });
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });

    this.yearlyPoints = yearlyPoints;

    var currentIdx = 0;
    var totalPoints = this.results.points;
    var currentCopy = this.copyResults(this.results.dimensionResults);
    for(var i = 2; i <= 4; i++) {
      let copy = this.copyResults(currentCopy);
      var currentPoints = 0;
      var currentYear = 2017;
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
        startYear: currentYear,
        endYear: currentYear + 1,
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
      period: 1,
      startYear: 2016,
      endYear: 2017,
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


