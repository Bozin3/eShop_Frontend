import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login-model';
import { LoginResponse } from '../models/login-response';
import { RegisterResponse } from '../models/register-response';
import { RegistrationModel } from '../models/registration-model';
import {map} from 'rxjs/operators';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean>;

  constructor(private httpClient: HttpClient) {
    const token = localStorage.getItem(TOKEN_KEY);
    // TODO: Check if token expired
    this.loggedIn = new BehaviorSubject(token !== null);
   }

  registerUser(user: RegistrationModel): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${environment.API_URL}/auth/register`, user);
  }

  login(user: LoginModel): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${environment.API_URL}/auth/login`, user)
    .pipe(
      map((response: LoginResponse) => {
        if ( response != null && response.success) {
          localStorage.setItem(TOKEN_KEY, response.token);
          this.loggedIn.next(true);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.loggedIn.next(false);
  }
}
