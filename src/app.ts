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
      { route: 'dimensions', name: 'dimensions', moduleId: './dimensions', nav: true, title: 'Dimensiones', auth: true },
      { route: 'questions', name: 'questions', moduleId: './questions', nav: true, title: 'Preguntas', auth: true },
      { route: 'selfAssessment', name: 'selfAssessment', moduleId: './selfAssessment', nav: true, title: 'Autodiagnóstico', auth: true },
      { route: 'improvementPlan', name: 'improvementPlan', moduleId: './improvementPlan', nav: true, title: 'Plan de mejora', auth: true }
    ]);

    this.router = router;
  }

  hideModal() {
    console.log('Hide modal');
    w.$modal.close();
  }
  
}
