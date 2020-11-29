import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login-model';
import { LoginResponse } from '../models/login-response';
import { RegisterResponse } from '../models/register-response';
import { RegistrationModel } from '../models/registration-model';
import {map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoggedUser } from '../models/logged-user';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtTokenHelper = new JwtHelperService();
  loggedUser: BehaviorSubject<LoggedUser>;

  constructor(private httpClient: HttpClient) {
    this.loggedUser = new BehaviorSubject(this.getLoggedInUser());
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
          this.loggedUser.next(this.getLoggedInUser());
        }
        return response;
      })
    );
  }

  getLoggedInUser(): LoggedUser {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token != null) {
      const isExpired = this.jwtTokenHelper.isTokenExpired(token);
      if (!isExpired) {
        const decodedToken = this.jwtTokenHelper.decodeToken(token);
        return { id: decodedToken.nameid, email: decodedToken.unique_name, token} as LoggedUser;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.loggedUser.next(null);
  }
}
