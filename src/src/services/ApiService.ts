import axios from 'axios';
import { AuthService } from './AuthService';

export class ApiService {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  public callApi(): Promise<any> {
    return this.authService.getUser().then(user => {
      if (user && user.access_token && user.profile.sub) {
        return this._callApi(user.access_token, user.profile.sub).catch(error => {
          if (error.response.status === 401) {
            return this.authService.renewToken().then(renewedUser => {
              return this._callApi(renewedUser.access_token, user.profile.sub);
            });
          }
          throw error;
        });
      } else if (user) {
        return this.authService.renewToken().then(renewedUser => {
          return this._callApi(renewedUser.access_token, user.profile.sub);
        });
      } else {
        throw new Error('user is not logged in');
      }
    });
  }

  private _callApi(token: string, userId: string) {
    const headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    };

    return axios.get(process.env.REACT_APP_API_ENDPOINT + `/profile/${userId}`, { headers });
  }
}
