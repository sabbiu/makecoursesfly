import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import * as fromApp from './store/app.reducer';
import { AppEffects } from './store/app.effects';
import { HttpTokenInterceptor } from './interceptors/http-token.interceptor';
import { NotificationService } from './services/notification.service';
import { FormHelperService } from './services/form-helper.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot(AppEffects),
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    NotificationService,
    FormHelperService,
  ],
})
export class CoreModule {}
