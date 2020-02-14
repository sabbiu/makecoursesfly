import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormHelperService } from '../core/services/form-helper.service';
import { AuthComponent } from './auth.component';
import { authReducer } from './store/auth.reducer';

class MockFormHelperService {
  isInvalid = jasmine.createSpy('isInvalid');
  isValid = jasmine.createSpy('isValid');
}

class MockActivatedRouteRegister {
  url = {
    subscribe: (fn: (value: Data) => void) => fn([{ path: 'register' }]),
  };
}
class MockActivatedRouteSignIn {
  url = {
    subscribe: (fn: (value: Data) => void) => fn([{ path: 'sign-in' }]),
  };
}
describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;

  describe('AuthComponent w/ Register', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          StoreModule.forRoot({ auth: authReducer }),
        ],
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRouteRegister },
          { provide: FormHelperService, useClass: MockFormHelperService },
        ],
        declarations: [AuthComponent],
      });

      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    });

    it('should create a component', () => {
      expect(component).toBeTruthy();
    });

    it('shows title: Register', () => {
      expect(getTitle()).toBe('Register');
    });
  });

  describe('AuthComponent w/ Sign In', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          StoreModule.forRoot({ auth: authReducer }),
        ],
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRouteSignIn },
          { provide: FormHelperService, useClass: MockFormHelperService },
        ],
        declarations: [AuthComponent],
      });

      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    });

    it('should create a component', () => {
      expect(component).toBeTruthy();
    });

    it('shows title: Sign In', () => {
      expect(getTitle()).toBe('Sign In');
    });
  });

  function getTitle() {
    const compiled = fixture.debugElement.nativeElement;
    return compiled.querySelector('h2').textContent;
  }
});
