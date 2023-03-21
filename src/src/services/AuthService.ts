import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';

export class AuthService {
  public userManager: UserManager;
  constructor() {
    const settings = {
      authority: process.env.REACT_APP_STS_AUTHORITY,
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: 'http://localhost:3000/signin-callback.html',
      //silent_redirect_uri: window.location.origin + '/silent-renew.html',
      post_logout_redirect_uri: 'http://localhost:3000',
      response_type: process.env.REACT_APP_RESPONSE_TYPE,
      scope: process.env.REACT_APP_CLIENT_SCOPE,
      loadUserInfo: true,
      automaticSilentRenew: true,
      acr_values: '',
      metadata: {
          issuer: process.env.REACT_APP_STS_AUTHORITY,
          authorization_endpoint: process.env.REACT_APP_STS_AUTHORITY + '/connect/authorize',
          token_endpoint: process.env.REACT_APP_STS_AUTHORITY + '/connect/token',
          jwks_uri: process.env.REACT_APP_STS_AUTHORITY + '/.well-known/openid-configuration/jwks',
          userinfo_endpoint: process.env.REACT_APP_STS_AUTHORITY + '/connect/userinfo',
          end_session_endpoint: process.env.REACT_APP_STS_AUTHORITY + '/connect/endsession'
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
