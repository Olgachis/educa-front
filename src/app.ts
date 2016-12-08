import {Aurelia} from 'aurelia-framework';
import {Redirect, Router, RouterConfiguration} from 'aurelia-router';

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
    config.title = 'Educa';

    config.addPipelineStep('authorize', AuthorizeStep);

    config.map([
      { route: ['', 'welcome'], name: 'welcome',    moduleId: './welcome',    nav: true, title: 'Modelo de gestión de calidad institucional EDUCA', class: 'welcome' },
      { route: 'dimensions',    name: 'dimensions', moduleId: './dimensions', nav: true, title: 'Dimensiones', auth: true }
    ]);

    this.router = router;
  }
}
