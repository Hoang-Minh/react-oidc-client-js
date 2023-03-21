import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';

export class AuthService {
  public userManager: UserManager;
  constructor() {
    const settings = {
      authority: process.env.REACT_APP_STS_AUTHORITY,
      client_id: process.env.REACT_APP_CLIENT_ID,
      //redirect_uri: window.location.origin + '/signin-callback.html',
      redirect_uri: 'http://localhost:44450/signin-callback.html',
      //silent_redirect_uri: window.location.origin + '/silent-renew.html',
      //post_logout_redirect_uri: window.location.origin,
      post_logout_redirect_uri: 'http://localhost:44450',
      response_type: process.env.REACT_APP_RESPONSE_TYPE,
      scope: process.env.REACT_APP_CLIENT_SCOPE,
      loadUserInfo: true,
        automaticSilentRenew: true,
        acr_values: '',
        userStore: new WebStorageStateStore({ store: window.localStorage }),

        metadata: {
            issuer: "http://localhost:5001",
            authorization_endpoint: 'http://localhost:5001/connect/authorize',
            token_endpoint: 'http://localhost:5001/connect/token',
            jwks_uri: 'http://localhost:5001/.well-known/openid-configuration/jwks',
            userinfo_endpoint: 'http://localhost:5001/connect/userinfo',
            end_session_endpoint: 'http://localhost:5001/connect/endsession'
        }
    };

    this.userManager = new UserManager(settings);

    Log.logger = console;
    Log.level = Log.INFO;
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }
}
