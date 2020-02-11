import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  title: string;
  isLogin: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.url.subscribe(data => {
      this.isLogin = data[data.length - 1].path !== 'register';
      this.title = this.isLogin ? 'Register' : 'Sign In';

      const username = new FormControl(null, Validators.required);
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
              password: new FormControl(null, Validators.required),
              password2: new FormControl(null, Validators.required),
            },
            this.passwordMatchValidator
          ),
          photo: new FormControl(null),
        });
      }
    });
  }

  onSubmit() {
    console.log(this.form);
    if (this.isLogin) {
      this.store.dispatch(new AuthActions.LoginStart(this.form.value));
    } else {
      this.store.dispatch(new AuthActions.RegisterStart(this.form.value));
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
  get password2() {
    return this.form.get('passwords.password2');
  }
  get photo() {
    return this.form.get('photo');
  }
}
