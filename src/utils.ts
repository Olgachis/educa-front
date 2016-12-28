import * as jQuery from 'jquery';
import 'foundation-sites';

// Ugly hacks
let $ = jQuery as any;
let w = window as any;
let Foundation = w.Foundation as any;
// End ugly hacks

export class Utils {
  static showSpinner() {
    $.LoadingOverlay("show");
  }
  static hideSpinner() {
    $.LoadingOverlay("hide");
  }
  static showModal(message) {
    let $modal = new Foundation.Reveal($('#modal-data'));
    w.$modal = $modal
    $('#modal-data .message').html(message);
    $modal.open();
  }
}
