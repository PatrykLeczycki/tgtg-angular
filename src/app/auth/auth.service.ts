import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {User} from '../user/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {getApiUrl} from "../shared/utils";

const API_URL = getApiUrl();

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  signup(email: string, password: string): Observable<{ email: string, password: string }> {
    return this.http
      .post<{ email: string, password: string }>(
        API_URL + '/auth/register',
        {
          email,
          password
        }
      ).pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        API_URL + '/auth/login',
        {
          email,
          password,
        }
      ).pipe(
        catchError(this.handleError),
        tap(resData => {

          const jwtData = resData.accessToken.split('.')[1];
          const jsonJwtData = JSON.parse(window.atob(jwtData));

          const id = jsonJwtData['sub'];
          const expiresIn = jsonJwtData['exp'];
          const roles = jsonJwtData['roles'];
          const tokenId = resData.accessToken;

          this.handleAuthentication(
            id,
            email,
            expiresIn,
            tokenId,
            roles
          );
        })
      );
  }

  autoLogin(): void {
    const userData: {
      id: string,
      email: string,
      expiresIn: Date,
      tokenId: string,
      roles: string[]
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.id, userData.email, new Date(userData.expiresIn), userData.tokenId, userData.roles);

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.expiresIn).getTime() -
        new Date().getTime();

      this.autoLogout(expirationDuration);
    }
  }

  logout(changedPassword?: boolean): void {
    this.user.next(null);

    this.router.navigate(['/auth'], {
      queryParams: {
        changedPassword: changedPassword
      }
    });

    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  confirmAccount(userId: string, registrationToken: string) {
    return this.http
      .post(
        API_URL + '/auth/confirmAccount',
        {
          userId, registrationToken
        }
      ).pipe(catchError(this.handleError));
  }

  resendConfirmationToken(email: string) {
    return this.http
      .post(
        API_URL + '/auth/resendConfirmationLink', email
      ).pipe(catchError(this.handleError));
  }

  retrievePasswordFirstStage(email: string) {
    return this.http
      .post(
        API_URL + '/auth/retrievePasswordFirst',
        {
          email
        }
      ).pipe(catchError(this.handleError));
  }

  retrievePasswordSecondStage(password: string, userId: string, lostPasswordToken: string) {
    return this.http
      .post(
        API_URL + '/auth/retrievePasswordSecond',
        {
          password, userId, lostPasswordToken
        }
      ).pipe(catchError(this.handleError));
  }

  changePassword(currentPassword: string, newPassword: string, userId: string) {
    return this.http
      .post(
        API_URL + '/auth/changePassword',
        {
          currentPassword, newPassword, userId
        }
      ).pipe(catchError(this.handleError));
  }


  private handleAuthentication(
    id: string,
    email: string,
    expiresIn: number,
    token: string,
    roles: string[]
  ): void {
    const expirationDate = new Date(expiresIn * 1000);
    const user = new User(id, email, expirationDate, token, roles);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Wystąpiły problemy z serwerem. Prosimy odczekać chwilę i spróbować ponownie.';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.message) {
      case 'Bad credentials':
        errorMessage = 'Błędne dane logowania';
        break;
      case 'Email is already used!':
        errorMessage = 'Istnieje już konto o podanym adresie e-mail';
        break;
      case 'User is disabled':
        errorMessage = 'Konto nieaktywne - prosimy o aktywację za pomocą linku otrzymanego po rejestracji';
        break;
      case 'Current password is incorrect':
        errorMessage = 'Podane aktualne hasło jest niepoprawne';
        break;
    }
    return throwError(errorMessage);
  }
}
