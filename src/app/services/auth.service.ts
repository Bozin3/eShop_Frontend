import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login-model';
import { RegistrationModel } from '../models/registration-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: RegistrationModel): Promise<boolean> {
    return this.httpClient.post<boolean>(`${environment.API_URL}/auth/register`, user).toPromise();
  }

  login(user: LoginModel): void {

  }
}
