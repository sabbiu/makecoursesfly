import { Component, TemplateRef, ViewChild, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  public modalRef: BsModalRef;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @Input() title: string = 'Modal';

  constructor(private modalService: BsModalService) {}

  public openModal() {
    this.modalRef = this.modalService.show(this.template);
  }
}
