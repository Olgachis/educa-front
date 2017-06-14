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
import { json } from 'aurelia-fetch-client';
import { Api } from './api';
import { Utils } from './utils';
import * as _ from 'lodash';
var AdminQuestionnaire = (function () {
    function AdminQuestionnaire(config) {
        this.showDetail = false;
        this.showDetailQuestion = false;
        this.showNewQuestionnaire = false;
        this.showEditQuestion = false;
        this.subirEtapa = function (stage) {
            var indice = _.indexOf(this.questionnaire.questionnaire.questions, stage);
            if (indice > 0) {
                this.cambiarEtapa(indice, indice - 1);
            }
        };
        this.bajarEtapa = function (stage) {
            var indice = _.indexOf(this.questionnaire.questionnaire.questions, stage);
            if (indice !== -1 && indice < this.questionnaire.questionnaire.questions.length - 1) {
                this.cambiarEtapa(indice, indice + 1);
            }
        };
        this.cambiarEtapa = function (num1, num2) {
            var itemTem = this.questionnaire.questionnaire.questions[num1];
            var item2 = this.questionnaire.questionnaire.questions[num2];
            this.questionnaire.questionnaire.questions[num1] = item2;
            this.questionnaire.questionnaire.questions[num2] = itemTem;
            this.saveQuestionnaire();
        };
        this.config = config;
        this.api = new Api(this.config);
    }
    AdminQuestionnaire.prototype.activate = function () {
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
    AdminQuestionnaire.prototype.showDetailFunc = function (questionnaireData, type) {
        this.showDetail = true;
        console.log(questionnaireData, type);
        if (type == 'create') {
            this.questionnaire = { name: "nuevoCuestionario", questionnaire: { text: "", questions: [] } };
        }
        else if (type == 'edit') {
            this.questionnaire = questionnaireData;
        }
    };
    AdminQuestionnaire.prototype.cleanVariables = function () {
        this.questionnaire = null;
        this.question = null;
        this.option = null;
        this.showDetailQuestion = false;
    };
    AdminQuestionnaire.prototype.hideDetailFunc = function (questionnaireData) {
        this.showDetail = false;
        this.cleanVariables();
        this.activate();
    };
    AdminQuestionnaire.prototype.showDetailQuestionFunc = function (questionData) {
        console.log('showDetailQuestionFunc', questionData);
        this.showDetailQuestion = true;
        if (questionData) {
            this.question = questionData;
        }
        else {
            this.question = { type: 'text', options: [] };
        }
        this.option = { type: 'text', name: null };
    };
    AdminQuestionnaire.prototype.editQuestion = function (questionData) {
        console.log('editQuestion', questionData);
        this.showDetailQuestion = true;
        this.showEditQuestion = true;
        if (questionData) {
            this.question = questionData;
        }
        else {
            this.question = { type: 'text', options: [] };
        }
        this.option = { type: 'text', name: null };
        this.identity = { id: questionData.id };
        this.question.edit = true;
    };
    AdminQuestionnaire.prototype.cancelCreateQuestionnaire = function (questionnaireData) {
        this.showNewQuestionnaire = false;
        this.cleanVariables();
    };
    AdminQuestionnaire.prototype.saveQuestionnaire = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch];
                    case 1:
                        _a.sent();
                        this.api = new Api(this.config);
                        Utils.showSpinner();
                        return [4 /*yield*/, this.api.fetch('/api/questionnaire', {
                                method: 'post',
                                body: json(this.questionnaire)
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json().then(function (data) {
                                _this.questionnaire = data;
                                console.log(_this.questionnaire);
                                Utils.hideSpinner();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminQuestionnaire.prototype.saveEditQuestion = function (questionData) {
        console.log('saveEditQuestion', questionData);
        var recoverQuestion = _.find(this.question.options, function (o) { return o == questionData; });
        _.replace(this.question.options, this.identity, questionData);
        this.saveQuestionnaire();
        this.showDetailQuestion = false;
        this.question = null;
        this.identity = null;
    };
    AdminQuestionnaire.prototype.addQuestion = function () {
        this.questionnaire.questionnaire.questions.push(this.question);
        this.showDetailQuestion = false;
        this.saveQuestionnaire();
        this.question = null;
    };
    AdminQuestionnaire.prototype.deleteQuestion = function (questionData) {
        var optionIndex = _.findIndex(this.questionnaire.questionnaire.questions, function (o) { return o == questionData; });
        this.questionnaire.questionnaire.questions.splice(optionIndex, 1);
        this.saveQuestionnaire();
    };
    AdminQuestionnaire.prototype.addOptionQuestion = function (optionData) {
        console.log('optionData', optionData);
        if (optionData.type == 'text') {
            this.question.options.push(optionData.name);
        }
        else if (optionData.type == 'otro') {
            this.question.options.push({ name: optionData.name, other: true });
        }
        this.option.name = null;
    };
    AdminQuestionnaire.prototype.deleteOptionQuestion = function (optionData) {
        var optionIndex = _.findIndex(this.question.options, function (o) { return o == optionData; });
        this.question.options.splice(optionIndex, 1);
    };
    AdminQuestionnaire.prototype.cancelQuestion = function () {
        this.question = null;
        this.option = null;
        this.showDetailQuestion = false;
    };
    AdminQuestionnaire.prototype.optionTypeQuestion = function (optionData) {
        if (optionData.type == 'text') {
            this.question.options = [];
        }
    };
    AdminQuestionnaire.prototype.replace = function (collection, identity, replacement) {
        var index = _.indexOf(collection, _.find(collection, identity));
        collection.splice(index, 1, replacement);
    };
    return AdminQuestionnaire;
}());
AdminQuestionnaire = __decorate([
    inject(AureliaConfiguration),
    __metadata("design:paramtypes", [Object])
], AdminQuestionnaire);
export { AdminQuestionnaire };
//# sourceMappingURL=adminQuestionnaire.js.map