import auth0 from 'auth0-js'
import axios from 'axios'

export default class AuthService {

  constructor() {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.authenticated = this.isAuthenticated()
    this.auth0 = new auth0.WebAuth({
      domain: 'crosstalk.auth0.com',
      clientID: '1z8l2E4BFbcN2UNXw4MS0zdmWN_W3Y_Y',
      // redirectUri: 'https://crosstalk.live/login',
      redirectUri: 'http://localhost:8000/login',
      responseType: 'token id_token',
      scope: 'openid profile email'
    })
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        // router.replace('home')
      } else if (err) {
        // router.replace('home')
        console.log(err)
      }
    })
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    this.authenticated = true

    axios.post('/api/new_user', {
      token: authResult.idToken
    }).then(response => {
      console.log(response);
    }).catch(e => {
      this.errors.push(e)
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null
    // navigate to the home route
    // router.replace('home')
    this.authenticated = false
  }

  login() {
    this.auth0.authorize()
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}