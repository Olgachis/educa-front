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
var Finance = (function () {
    function Finance(config) {
        this.config = config;
        this.api = new Api(this.config);
    }
    Finance.prototype.activate = function () {
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
    Finance.prototype.showQuestionnaireList = function (questionnaire) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedQuestionnaireId, modifyQuestionsSecondary, modifyQuestionsSixt, responses, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.listEnabled = true;
                        this.questionnaireEnabled = false;
                        this.selectedQuestionnaire = questionnaire;
                        selectedQuestionnaireId = this.selectedQuestionnaire.id;
                        modifyQuestionsSecondary = [
                            { id: 'whatsANeed', "options": ["Cosas que quiero, pero puedo esperar para comprarlas.", "Algo sin lo que la vida sería muy difícil.", "No lo sé."] },
                            { id: 'iSaveOtherMoney', "options": ["Otra, ¿cuál?"] },
                            { id: 'whenCreateBudget', "options": ["Siempre", "De manera frecuente", "Muy poco", "No elaboro un presupuesto", "No me parece necesario"] }
                        ];
                        modifyQuestionsSixt = [
                            { id: 'howManyTimes', "options": ["Siempre", "Algunas veces", "Pocas veces", "Nunca", "No tengo meta de ahorro"] }
                        ];
                        _.each(this.selectedQuestionnaire.questionnaire.questions, function (el) {
                            if (selectedQuestionnaireId == 'secondary-students') {
                                var nuevasOpciones = _.find(modifyQuestionsSecondary, function (o) { return o.id == el['id']; });
                                if (nuevasOpciones) {
                                    el['options'] = nuevasOpciones.options;
                                }
                                if (el['id'] == 'iSaveOtherMoney') {
                                    el['type'] = 'options';
                                }
                                if (el['id'] == 'savingInstitutions') {
                                    el['displayName'] = "¿Cuáles de las siguientes opciones son ejemplos de una institución financiera?";
                                }
                            }
                            else if (selectedQuestionnaireId == 'sixth') {
                                var nuevasOpciones = _.find(modifyQuestionsSixt, function (o) { return o.id == el['id']; });
                                if (nuevasOpciones) {
                                    el['options'] = nuevasOpciones.options;
                                }
                                if (el['id'] == 'whereSaveMoney') {
                                    el['type'] = 'multioptions';
                                }
                                if (el['id'] == 'wantToLearn') {
                                    el['type'] = 'multioptions';
                                }
                            }
                        });
                        console.log(questionnaire);
                        return [4 /*yield*/, this.api.fetch('/api/simpleQuestionnaire/' + questionnaire.id + '/responses')];
                    case 1:
                        responses = _b.sent();
                        _a = this;
                        return [4 /*yield*/, responses.json()];
                    case 2:
                        _a.responses = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Finance.prototype.showQuestionnaire = function (questionnaire) {
        this.listEnabled = false;
        this.questionnaireEnabled = true;
        questionnaire.questionnaire.questions.forEach(function (question) {
            if (question.options) {
                question.options = question.options.map(function (o) {
                    if (typeof (o) == 'string') {
                        return {
                            name: o
                        };
                    }
                    else {
                        return o;
                    }
                });
            }
        });
        this.selectedQuestionnaire = questionnaire;
        window.scrollTo(0, 0);
    };
    Finance.prototype.saveQuestionnaire = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, result, questionnaires, currentQuestionnaire, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Utils.showSpinner();
                        console.log(this.selectedQuestionnaire);
                        response = this.api.fetch('/api/simpleQuestionnaire', {
                            method: 'post',
                            body: json(this.selectedQuestionnaire)
                        });
                        return [4 /*yield*/, response];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, this.api.fetch('/api/simpleQuestionnaire/list')];
                    case 2:
                        questionnaires = _b.sent();
                        currentQuestionnaire = this.selectedQuestionnaire.id;
                        _a = this;
                        return [4 /*yield*/, questionnaires.json()];
                    case 3:
                        _a.questionnaires = _b.sent();
                        this.hideQuestionnaire();
                        this.selectedQuestionnaire = this.questionnaires.questionnaires.filter(function (q) {
                            return currentQuestionnaire == q.id;
                        })[0];
                        this.showQuestionnaireList(this.selectedQuestionnaire);
                        Utils.hideSpinner();
                        return [2 /*return*/];
                }
            });
        });
    };
    Finance.prototype.loadQuestionnaire = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var questionnaire, fullQuestionnaire, selectedQuestionnaireId, modifyQuestionsSecondary, modifyQuestionsSixt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.questionnaireEnabled = true;
                        this.listEnabled = false;
                        return [4 /*yield*/, this.api.fetch('/api/simpleQuestionnaire/responses/' + res.id)];
                    case 1:
                        questionnaire = _a.sent();
                        return [4 /*yield*/, questionnaire.json()];
                    case 2:
                        fullQuestionnaire = _a.sent();
                        this.selectedQuestionnaire.responseId = res.id;
                        this.selectedQuestionnaire.questionnaire = fullQuestionnaire.data;
                        selectedQuestionnaireId = this.selectedQuestionnaire.id;
                        modifyQuestionsSecondary = [
                            { id: 'whatsANeed', "options": ["Cosas que quiero, pero puedo esperar para comprarlas.", "Algo sin lo que la vida sería muy difícil.", "No lo sé."] },
                            { id: 'iSaveOtherMoney', "options": ["Otra, ¿cuál?"] },
                            { id: 'whenCreateBudget', "options": ["Siempre", "De manera frecuente", "Muy poco", "No elaboro un presupuesto", "No me parece necesario"] }
                        ];
                        modifyQuestionsSixt = [
                            { id: 'howManyTimes', "options": ["Siempre", "Algunas veces", "Una vez", "Nunca", "No tengo meta de ahorro"] }
                        ];
                        _.each(this.selectedQuestionnaire.questionnaire.questions, function (el) {
                            if (selectedQuestionnaireId == 'secondary-students') {
                                var nuevasOpciones_1 = _.find(modifyQuestionsSecondary, function (o) { return o.id == el['id']; });
                                if (nuevasOpciones_1) {
                                    var i_1 = 0;
                                    _.each(el.options, function (opt) {
                                        opt.name = nuevasOpciones_1.options[i_1];
                                        i_1++;
                                    });
                                }
                                if (el['id'] == 'iSaveOtherMoney') {
                                    el['type'] = 'options';
                                }
                                if (el['id'] == 'savingInstitutions') {
                                    el['displayName'] = "¿Cuáles de las siguientes opciones son ejemplos de una institución financiera?";
                                }
                            }
                            else if (selectedQuestionnaireId == 'sixth') {
                                var nuevasOpciones_2 = _.find(modifyQuestionsSecondary, function (o) { return o.id == el['id']; });
                                if (nuevasOpciones_2) {
                                    var i_2 = 0;
                                    _.each(el.options, function (opt) {
                                        opt.name = nuevasOpciones_2.options[i_2];
                                        i_2++;
                                    });
                                }
                                if (el['id'] == 'whereSaveMoney') {
                                    el['type'] = 'multioptions';
                                }
                                if (el['id'] == 'wantToLearn') {
                                    el['type'] = 'multioptions';
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Finance.prototype.hideQuestionnaireList = function () {
        this.questionnaireEnabled = false;
        this.listEnabled = false;
        this.selectedQuestionnaire = null;
        window.scrollTo(0, 0);
    };
    Finance.prototype.hideQuestionnaire = function () {
        this.questionnaireEnabled = false;
        this.listEnabled = true;
        window.scrollTo(0, 0);
    };
    return Finance;
}());
Finance = __decorate([
    inject(AureliaConfiguration),
    __metadata("design:paramtypes", [Object])
], Finance);
export { Finance };
//# sourceMappingURL=finance.js.map