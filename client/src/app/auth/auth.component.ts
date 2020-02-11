import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as fromApp from '../core/store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { ActivatedRoute } from '@angular/router';
import { FormHelperService } from '../core/services/form-helper.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  form: FormGroup;
  title: string;
  isLogin: boolean;
  loading: boolean;

  storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private fhService: FormHelperService
  ) {}

  ngOnInit() {
    this.route.url.subscribe(data => {
      this.isLogin = data[data.length - 1].path !== 'register';
      this.title = this.isLogin ? 'Register' : 'Sign In';

      const username = new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]);
      if (this.isLogin) {
        this.form = new FormGroup({
          username,
          passwords: new FormGroup({
            password: new FormControl(null, Validators.required),
          }),
        });
      } else {
        this.form = new FormGroup({
          name: new FormControl(null, Validators.required),
          username,
          passwords: new FormGroup(
            {
              password: new FormControl(null, [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(20),
              ]),
              password2: new FormControl(null, Validators.required),
            },
            this.passwordMatchValidator
          ),
          photo: new FormControl(null),
        });
      }
    });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
    });
  }

  ngOnDestroy() {
    if (this.storeSub) this.storeSub.unsubscribe();
  }

  onSubmit() {
    // console.log(this.form);
    if (this.isLogin) {
      this.store.dispatch(
        new AuthActions.LoginStart({
          username: this.form.value.username,
          password: this.form.value.passwords.password,
        })
      );
    } else {
      this.store.dispatch(
        new AuthActions.RegisterStart({
          username: this.form.value.username,
          password: this.form.value.passwords.password,
          name: this.form.value.name,
          photo: this.form.value.photo,
        })
      );
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { passwordDoesNotMatch: boolean } {
    if (control.get('password').value !== control.get('password2').value) {
      return { passwordDoesNotMatch: true };
    }
  }

  get name() {
    return this.form.get('name');
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('passwords.password');
  }
  get passwords() {
    return this.form.get('passwords');
  }
  get password2() {
    return this.form.get('passwords.password2');
  }
  get photo() {
    return this.form.get('photo');
  }
}
