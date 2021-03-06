import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterResponse } from 'src/app/models/register-response';
import { RegistrationModel } from 'src/app/models/registration-model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formsGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formsGroup = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      age: new FormControl(18, Validators.min(18)),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  checkConfirmPassword(formGroup: FormGroup): boolean {
    return formGroup.get('password').value === formGroup.get('confirmPassword').value;
  }

  register(): void {
    if (this.formsGroup.valid) {
      if (this.checkConfirmPassword(this.formsGroup)) {
        const registrationData = this.formsGroup.value as RegistrationModel;
        console.log(registrationData);
        this.authService.registerUser(registrationData).subscribe((result: RegisterResponse) => {
          if (result.success) {
            this.router.navigate(['/login']);
          } else {
            console.log(result.message);
          }
        });
      } else {
        // TODO: display alert message
        console.log('Wrong confirm password, please try again!');
      }
    } else {
      // TODO: display alert message
      console.log('Invalid form');
    }
  }

}
