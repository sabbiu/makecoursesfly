import { Component, Injector } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: '[app-modal-footer]',
  template: `
    <ng-content></ng-content>
    <button type="button" class="btn btn-link" (click)="modal.modalRef.hide()">
      Close
    </button>
  `,
})
export class ModalFooterComponent {
  public modal: ModalComponent = this.injector.get(ModalComponent);

  constructor(private readonly injector: Injector) {}
}
