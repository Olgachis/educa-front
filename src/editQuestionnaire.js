var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { inject } from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';
import { Api } from './api';
import * as _ from 'lodash';
import * as nv from 'nvd3';
import * as d3 from 'd3';
function innerCreateDataChart(idGrafica, responses) {
    var question1 = new Array();
    _.forEach(responses, function (value) {
        var questions = value.data.questions;
        question1.push(questions[idGrafica]);
    });
    var datos = _.groupBy(question1, 'value');
    var testdata = new Array();
    _.forEach(datos, function (value, key) {
        testdata.push({ key: key, y: value.length });
    });
    var height = 400;
    var width = 400;
    nv.addGraph(function () {
        var chart = nv.models.pieChart()
            .x(function (d) { return d.key; })
            .y(function (d) { return d.y; })
            .width(width)
            .labelThreshold(.05)
            .height(height);
        var selectGrafica = '#test' + idGrafica;
        d3.select(selectGrafica)
            .datum(testdata)
            .transition().duration(1200)
            .attr('width', width)
            .attr('height', height)
            .call(chart);
        return chart;
    });
}
;
function innerCreateDataBarChart(idGrafica, responses) {
    console.log('innerCreateDataBarChart', idGrafica);
    var optionsQuestionM = new Array();
    var values = new Array();
    _.forEach(responses, function (value) {
        var questions = value.data.questions;
        optionsQuestionM.push(questions[idGrafica].options);
    });
    optionsQuestionM = _.flattenDeep(optionsQuestionM);
    var mapOptions = _.groupBy(optionsQuestionM, 'name');
    _.forEach(mapOptions, function (value, key) {
        var total = _.countBy(value, 'value');
        values.push({ label: key, value: total['true'] });
    });
    var historicalBarChart = new Array();
    historicalBarChart.push({ key: "idGrafica", values: values });
    nv.addGraph(function () {
        var chart = nv.models.discreteBarChart()
            .x(function (d) { return d.label; })
            .y(function (d) { return d.value; })
            .width(560)
            .staggerLabels(true)
            .staggerLabels(historicalBarChart[0].values.length > 8)
            .showValues(true)
            .duration(250)
            .margin({ bottom: 250 });
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
var EditQuestionnaire = (function () {
    function EditQuestionnaire(config) {
        this.estructura = new Array();
        this.config = config;
        this.api = new Api(this.config);
        this.showQuestionnaireList();
    }
    EditQuestionnaire.prototype.showQuestionnaireList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questionnaires, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.api.fetch('/api/simpleQuestionnaire/list')];
                    case 2:
                        questionnaires = _b.sent();
                        _a = this;
                        return [4 /*yield*/, questionnaires.json()];
                    case 3:
                        _a.questionnaires = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditQuestionnaire.prototype.showQuestionnaireDetail = function (questionnaire) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var selectedQuestionnaireId, index, responses, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.listEnabled = true;
                        this.questionnaireEnabled = false;
                        this.selectedQuestionnaire = questionnaire;
                        selectedQuestionnaireId = this.selectedQuestionnaire.id;
                        index = 0;
                        return [4 /*yield*/, this.api.fetch('/api/simpleQuestionnaire/' + questionnaire.id + '/listFullResponses')];
                    case 1:
                        responses = _b.sent();
                        _a = this;
                        return [4 /*yield*/, responses.json().then(function (data) {
                                _this.responses = data.responses;
                                _.forEach(_this.selectedQuestionnaire.questionnaire.questions, function (value) {
                                    console.log(index);
                                    if (value.type == "options" || value.type == "text") {
                                        innerCreateDataChart(index, data.responses);
                                    }
                                    if (value.type == "multioptions") {
                                        innerCreateDataBarChart(index, data.responses);
                                    }
                                    index++;
                                });
                            })];
                    case 2:
                        _a.responses = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditQuestionnaire.prototype.demoCreateDataChart = function () {
        var question1 = new Array();
        var question2 = new Array();
        var question3 = new Array();
        var listaQuestions = new Array();
        var optionsQuestionM = new Array();
        _.forEach(this.responses.responses, function (value) {
            var questions = value.data.questions;
            question1.push(questions[0]);
            question2.push(questions[8]);
            question3.push(questions[7]);
            optionsQuestionM.push(questions[7].options);
        });
        var datos = _.groupBy(question1, 'value');
        var datos2 = _.groupBy(question2, 'value');
        var datos3 = _.groupBy(question3, 'value');
        this.displayNameQ1 = question1[0].displayName;
        this.displayNameQ2 = question2[0].displayName;
        this.displayNameQ3 = question3[0].displayName;
        var testdata = new Array();
        var testdata2 = new Array();
        var testdata3 = new Array();
        _.forEach(datos, function (value, key) {
            testdata.push({ key: key, y: value.length });
        });
        _.forEach(datos2, function (value, key) {
            testdata2.push({ key: key, y: value.length });
        });
        _.forEach(datos3, function (value, key) {
            testdata3.push({ key: key, y: value.length });
        });
        var height = 400;
        var width = 400;
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                .x(function (d) { return d.key; })
                .y(function (d) { return d.y; })
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
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                .x(function (d) { return d.key; })
                .y(function (d) { return d.y; })
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
        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                .x(function (d) { return d.key; })
                .y(function (d) { return d.y; })
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
        var mapOptions = _.groupBy(optionsQuestionM, 'name');
        _.forEach(mapOptions, function (value, key) {
            var total = _.countBy(value, 'value');
            values.push({ label: key, value: total['true'] });
        });
        var historicalBarChart2 = new Array();
        historicalBarChart2.push({ key: "gola", values: values });
        nv.addGraph(function () {
            var chart = nv.models.discreteBarChart()
                .x(function (d) { return d.label; })
                .y(function (d) { return d.value; })
                .width(560)
                .staggerLabels(true)
                .staggerLabels(historicalBarChart2[0].values.length > 8)
                .showValues(true)
                .duration(250)
                .margin({ bottom: 250 });
            chart.xAxis.rotateLabels(-90);
            chart.yAxis.tickFormat(d3.format(',.3f'));
            d3.select('#chart1 svg')
                .datum(historicalBarChart2)
                .call(chart);
            nv.utils.windowResize(chart.update);
            return chart;
        });
    };
    return EditQuestionnaire;
}());
EditQuestionnaire = __decorate([
    inject(AureliaConfiguration),
    __metadata("design:paramtypes", [Object])
], EditQuestionnaire);
export { EditQuestionnaire };
//# sourceMappingURL=editQuestionnaire.js.map