import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login-model';
import { LoginResponse } from 'src/app/models/login-response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formsGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formsGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('' , [Validators.required, Validators.minLength(6)]),
    });
  }

  login(): void {
    if (this.formsGroup.valid) {
      const loginData = this.formsGroup.value as LoginModel;
      console.log(loginData);
      this.authService.login(loginData).subscribe((result: LoginResponse) => {
        if (result.success) {
          this.router.navigate(['/']);
        } else {
          console.log(result.message);
        }
      });
    } else {
      // TODO: display alert message
      console.log('Invalid form');
    }
  }

}
