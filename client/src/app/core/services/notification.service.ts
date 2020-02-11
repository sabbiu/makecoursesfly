import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

const toastrOptions = {
  tapToDismiss: true,
  positionClass: 'toast-top-center',
};

@Injectable()
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

  info(message: string) {
    this.toastrService.info(message, '', toastrOptions);
  }

  error(message: string) {
    this.toastrService.error(message, '', toastrOptions);
  }
}
