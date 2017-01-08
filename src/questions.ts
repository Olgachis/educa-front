import {lazy, computedFrom} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Api} from './api';
import {Utils} from './utils';

import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';

function buildArray(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push(obj[key]);
    return arr;
  }, new Array());
}

@inject(AureliaConfiguration)
export class Questions {

  private config;
  private evaluation;
  private dimensions;

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
    for(var kd in this.evaluation.dimensions) {
      var dimension = this.evaluation.dimensions[kd];
      dimension.subdimensions = buildArray(dimension.subdimensions);
      dimension.subdimensions.sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
    }
    this.dimensions = buildArray(this.evaluation.dimensions);
    var i = 0;
    for(var kd in this.dimensions) {
      var dimension = this.dimensions[kd];
      for(var ks in dimension.subdimensions) {
        var subdimension = dimension.subdimensions[ks];
        for(var kq in subdimension.questions) {
          var question = subdimension.questions[kq];
          question.num = ++i;
        }
      }
    }
    this.dimensions.sort((a, b) => {
      return a.id.sortOrder - b.id.sortOrder;
    });
  }

}

