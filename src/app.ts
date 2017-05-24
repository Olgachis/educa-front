import {Aurelia} from 'aurelia-framework';
import {Redirect, Router, RouterConfiguration} from 'aurelia-router';

import * as jQuery from 'jquery';
import 'gasparesganga-jquery-loading-overlay/src/loadingoverlay'
import 'foundation-sites';

// Ugly hacks
let $ = jQuery as any;
let w = window as any;
let Foundation = w.Foundation as any;
// End ugly hacks

class AuthorizeStep {
  run(routingContext, next) {
    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = AuthorizeStep.isLoggedIn();
      if (!isLoggedIn) {
        return next.cancel(new Redirect('/'));
      }
    }
    return next();
  }

  static isLoggedIn(): boolean {
    var auth_token = localStorage.getItem("auth_token");
    return (typeof auth_token !== "undefined" && auth_token !== null);
  }

}

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'EDUCA';

    config.addPipelineStep('authorize', AuthorizeStep);

    config.map([
      { route: ['', 'welcome'], name: 'welcome',    moduleId: './welcome',    nav: true, title: 'Modelo de gestión de calidad institucional EDUCA', class: 'welcome' },
      { route: 'finance', name: 'finance', moduleId: './finance', nav: true, title: 'Finanzas personales', auth: true },
      { route: 'dimensions', name: 'dimensions', moduleId: './dimensions', nav: true, title: 'Dimensiones', auth: true },
      { route: 'admin', name: 'admin', moduleId: './admin', nav: false, title: 'Administración', auth: true },
      { route: 'questions', name: 'questions', moduleId: './questions', nav: true, title: 'Preguntas', auth: true },
      { route: 'selfAssessment', name: 'selfAssessment', moduleId: './selfAssessment', nav: true, title: 'Autodiagnóstico Institucional EDUCA', auth: true },
      { route: 'improvementPlan', name: 'improvementPlan', moduleId: './improvementPlan', nav: true, title: 'Plan de Mejora EDUCA', auth: true },
      { route: 'improvementPlanSelection', name: 'improvementPlanSelection', moduleId: './improvementPlanSelection', nav: true, title: 'Plan de Mejora EDUCA', auth: true },
      { route: 'improvementPlanDefinition', name: 'improvementPlanDefinition', moduleId: './improvementPlanDefinition', nav: true, title: 'Plan de Mejora EDUCA', auth: true },
      { route: 'improvementPlanPrediction', name: 'improvementPlanPrediction', moduleId: './improvementPlanPrediction', nav: true, title: 'Plan de Mejora EDUCA', auth: true },
      { route: 'glossary', name: 'glossary', moduleId: './glossary', nav: true, title: 'Glosario', auth: true },
      { route: 'dashboard', name: 'dashboard', moduleId: './dashboard', nav: true, title: 'Tablero', auth: true },
      { route: 'adminDashboard', name: 'adminDashboard', moduleId: './adminDashboard', nav: true, title: 'Tablero principal', auth: true },
      { route: 'institutionList', name: 'institutionList', moduleId: './institutionList', nav: true, title: 'Lista de instituciones', auth: true },
      { route: 'adminQuestionnaire', name: 'adminQuestionnaire', moduleId: './adminQuestionnaire', nav: true, title: 'Lista de cuestionarios', auth: true },
      { route: ':id/previewQuestionnaire', name: 'previewQuestionnaire', moduleId: './previewQuestionnaire' },
      { route: 'editQuestionnaire', name: 'editQuestionnaire', moduleId: './editQuestionnaire', nav: true, title: 'Lista de resultados', auth: true },

    ]);

    this.router = router;
  }

  hideModal() {
    console.log('Hide modal');
    w.$modal.close();
  }

}
